import React from 'react';
import { useTimelineContext } from './context';

export interface TimelineMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const TimelineMarker = React.forwardRef<HTMLDivElement, TimelineMarkerProps>(
  ({ value, style, ...props }, forwardedRef) => {
    const { min, max } = useTimelineContext();
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    return (
      <div
        ref={forwardedRef}
        style={{
          position: 'absolute',
          left: `${percentage}%`,
          transform: 'translateX(-50%)',
          ...style,
        }}
        {...props}
      />
    );
  }
);
TimelineMarker.displayName = 'TimelineMarker';
