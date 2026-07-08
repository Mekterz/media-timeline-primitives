import React, { useState, useCallback, useEffect } from 'react';
import { TimelineContext } from './context';
import { useTimelineMath } from '../hooks/useTimelineMath';

export interface TimelineRootProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const TimelineRoot = React.forwardRef<HTMLDivElement, TimelineRootProps>(
  ({ value = 0, onValueChange, onValueCommit, min = 0, max = 100, step = 1, children, onPointerDown, onPointerMove, onPointerLeave, onKeyDown, ...props }, forwardedRef) => {
    const { trackRef, calculateValueFromPointer } = useTimelineMath(min, max);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const handlePointerUpdate = useCallback(
      (clientX: number) => {
        const newValue = calculateValueFromPointer(clientX);
        onValueChange?.(newValue);
        return newValue;
      },
      [calculateValueFromPointer, onValueChange]
    );

    const handlePointerMove = useCallback(
      (e: PointerEvent) => {
        if (!isScrubbing) return;
        e.preventDefault();
        handlePointerUpdate(e.clientX);
      },
      [isScrubbing, handlePointerUpdate]
    );

    const handlePointerUp = useCallback((e: PointerEvent) => {
      setIsScrubbing(false);
      const finalValue = calculateValueFromPointer(e.clientX);
      onValueCommit?.(finalValue);
    }, [calculateValueFromPointer, onValueCommit]);

    useEffect(() => {
      if (isScrubbing) {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
      }
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }, [isScrubbing, handlePointerMove, handlePointerUp]);

    const handleInternalPointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsScrubbing(true);
        handlePointerUpdate(e.clientX);
      },
      [handlePointerUpdate]
    );

    const handleInternalPointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
           setHoverValue(calculateValueFromPointer(e.clientX));
        }
      },
      [calculateValueFromPointer]
    );

    const handleInternalPointerLeave = useCallback(
      () => {
        setHoverValue(null);
      },
      []
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        let newValue = value;
        const pageStep = (max - min) / 10;

        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
            newValue = Math.max(min, value - step);
            break;
          case 'ArrowRight':
          case 'ArrowUp':
            newValue = Math.min(max, value + step);
            break;
          case 'PageDown':
            newValue = Math.max(min, value - pageStep);
            break;
          case 'PageUp':
            newValue = Math.min(max, value + pageStep);
            break;
          case 'Home':
            newValue = min;
            break;
          case 'End':
            newValue = max;
            break;
          default:
            return;
        }

        e.preventDefault();
        onValueChange?.(newValue);
        onValueCommit?.(newValue);
      },
      [value, min, max, step, onValueChange, onValueCommit]
    );

    return (
      <TimelineContext.Provider value={{ value, min, max, hoverValue, trackRef }}>
        <div
          ref={forwardedRef}
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          {...props}
          onPointerDown={(e) => {
            onPointerDown?.(e);
            handleInternalPointerDown(e);
          }}
          onPointerMove={(e) => {
            onPointerMove?.(e);
            handleInternalPointerMove(e);
          }}
          onPointerLeave={(e) => {
            onPointerLeave?.(e);
            handleInternalPointerLeave();
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            handleKeyDown(e);
          }}
          style={{ position: 'relative', touchAction: 'none', userSelect: 'none', outline: 'none', ...props.style }}
        >
          {children}
        </div>
      </TimelineContext.Provider>
    );
  }
);
TimelineRoot.displayName = 'TimelineRoot';
