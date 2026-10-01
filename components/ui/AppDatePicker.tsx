'use client';

import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { Z_POPOVER } from '@/lib/layout';
import {
  addDays,
  addMonths,
  formatDisplayDate,
  formatMonthYear,
  getMonthGrid,
  isSameDay,
  parseISODate,
  toISODate,
  weekdayLabels,
} from '@/lib/dateUtils';
import { usePopoverPosition } from './usePopoverPosition';

interface AppDatePickerProps {
  value: string; // ISO 'YYYY-MM-DD', '' for empty
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

const AppDatePicker = forwardRef<HTMLButtonElement, AppDatePickerProps>(function AppDatePicker(
  { value, onChange, placeholder = 'Select date…', disabled, id },
  forwardedRef
) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const selectedDate = parseISODate(value);
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? today);
  const [focusedDate, setFocusedDate] = useState(() => selectedDate ?? today);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const position = usePopoverPosition(triggerRef, open);

  useEffect(() => {
    if (!open) return;
    const base = selectedDate ?? today;
    setViewMonth(base);
    setFocusedDate(base);
    const t = setTimeout(() => gridRef.current?.focus(), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

  const commit = (date: Date) => {
    onChange(toISODate(date));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const grid = getMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth());

  const moveFocus = (delta: number) => {
    setFocusedDate(prev => {
      const next = addDays(prev, delta);
      setViewMonth(next);
      return next;
    });
  };

  const handleGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); moveFocus(1); break;
      case 'ArrowLeft':  e.preventDefault(); moveFocus(-1); break;
      case 'ArrowDown':  e.preventDefault(); moveFocus(7); break;
      case 'ArrowUp':    e.preventDefault(); moveFocus(-7); break;
      case 'PageUp':     e.preventDefault(); setViewMonth(v => addMonths(v, -1)); setFocusedDate(d => addMonths(d, -1)); break;
      case 'PageDown':   e.preventDefault(); setViewMonth(v => addMonths(v, 1)); setFocusedDate(d => addMonths(d, 1)); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(focusedDate);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
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
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          textAlign: 'left',
        }}
      >
        <span style={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: value ? 'var(--on-surface)' : 'var(--text-muted)',
        }}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Calendar size={16} strokeWidth={1.8} style={{ flexShrink: 0, color: 'var(--on-surface-variant)' }} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          className="panel"
          style={{
            position: 'fixed',
            top: position.top, left: position.left,
            zIndex: Z_POPOVER,
            width: 288,
            padding: 12,
          }}
        >
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth(v => addMonths(v, -1))}
              style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex' }}
            >
              <ChevronLeft size={16} strokeWidth={1.8} />
            </button>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
              {formatMonthYear(viewMonth)}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth(v => addMonths(v, 1))}
              style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex' }}
            >
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          </div>

          {/* Weekday labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
            {weekdayLabels().map(label => (
              <div key={label} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--on-surface-variant)', padding: '4px 0' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div
            ref={gridRef}
            role="grid"
            aria-label={formatMonthYear(viewMonth)}
            tabIndex={0}
            onKeyDown={handleGridKeyDown}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, outline: 'none' }}
          >
            {grid.map(day => {
              const outside = day.getMonth() !== viewMonth.getMonth();
              const isToday = isSameDay(day, today);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isFocused = isSameDay(day, focusedDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={clsx('app-datepicker-day', {
                    'outside-month': outside,
                    today: isToday,
                    selected: isSelected,
                    focused: isFocused,
                  })}
                  onClick={() => commit(day)}
                  tabIndex={-1}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => commit(today)}
            >
              Today
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => { onChange(''); setOpen(false); triggerRef.current?.focus(); }}
            >
              Clear
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

export default AppDatePicker;
