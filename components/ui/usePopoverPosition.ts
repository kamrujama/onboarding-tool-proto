'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';

export interface PopoverPosition {
  top: number;
  left: number;
  width: number;
}

// Positions a portaled, position:fixed popover relative to its trigger element.
// Must be fixed (not absolute) because triggers can live inside a transformed
// ancestor (e.g. NewCaseDrawer's .slide-over), which would otherwise reposition it.
export function usePopoverPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean
): PopoverPosition {
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0, width: 0 });

  const update = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [triggerRef]);

  useEffect(() => {
    if (!open) return;
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  return position;
}
