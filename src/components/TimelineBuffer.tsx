import React from 'react';
import { useTimelineContext } from './context';

export interface TimelineBufferProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const TimelineBuffer = React.forwardRef<HTMLDivElement, TimelineBufferProps>(
  ({ value, style, ...props }, forwardedRef) => {
    const { min, max } = useTimelineContext();
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    return (
      <div
        ref={forwardedRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${percentage}%`,
          ...style,
        }}
        {...props}
      />
    );
  }
);
TimelineBuffer.displayName = 'TimelineBuffer';
