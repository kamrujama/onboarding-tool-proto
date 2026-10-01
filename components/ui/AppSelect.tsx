'use client';

import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { Z_POPOVER } from '@/lib/layout';
import { usePopoverPosition } from './usePopoverPosition';

export interface AppSelectOption {
  value: string;
  label: string;
}

interface AppSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  id?: string;
}

const AppSelect = forwardRef<HTMLButtonElement, AppSelectProps>(function AppSelect(
  { value, onChange, options, placeholder = 'Select…', searchable = true, disabled, id },
  forwardedRef
) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  const position = usePopoverPosition(triggerRef, open);

  const filtered = searchable && query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlightedIndex(Math.max(0, options.findIndex(o => o.value === value)));
    const t = setTimeout(() => {
      if (searchable) searchInputRef.current?.focus();
      else listboxRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const commit = (next: string) => {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[highlightedIndex];
      if (opt) commit(opt.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={node => {
          triggerRef.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        id={id}
        type="button"
        className="input-base"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          textAlign: 'left',
        }}
      >
        <span style={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: selected ? 'var(--on-surface)' : 'var(--text-muted)',
        }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          style={{
            flexShrink: 0, color: 'var(--on-surface-variant)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          className="panel"
          style={{
            position: 'fixed',
            top: position.top, left: position.left, width: position.width,
            zIndex: Z_POPOVER,
            maxHeight: 280,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {searchable && (
            <div style={{ padding: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  strokeWidth={1.8}
                  style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', pointerEvents: 'none' }}
                />
                <input
                  ref={searchInputRef}
                  className="input-base"
                  style={{ height: 32, paddingLeft: 28, fontSize: 13 }}
                  placeholder="Search…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleListKeyDown}
                />
              </div>
            </div>
          )}
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            onKeyDown={handleListKeyDown}
            style={{ overflowY: 'auto', padding: 4, outline: 'none' }}
          >
            {filtered.length === 0 && (
              <div style={{ padding: '10px 12px', fontSize: 13, color: 'var(--on-surface-variant)' }}>
                No results
              </div>
            )}
            {filtered.map((opt, i) => (
              <div
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={clsx('app-select-option', {
                  highlighted: i === highlightedIndex,
                  selected: opt.value === value,
                })}
                onMouseEnter={() => setHighlightedIndex(i)}
                onClick={() => commit(opt.value)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label}</span>
                {opt.value === value && <Check size={14} strokeWidth={2} style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

export default AppSelect;
