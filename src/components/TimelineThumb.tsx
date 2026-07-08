import React from 'react';
import { useTimelineContext } from './context';

export interface TimelineThumbProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineThumb = React.forwardRef<HTMLDivElement, TimelineThumbProps>(
  ({ style, ...props }, forwardedRef) => {
    const { value, min, max } = useTimelineContext();
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div
        ref={forwardedRef}
        style={{
          position: 'absolute',
          left: `${percentage}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          ...style,
        }}
        {...props}
      />
    );
  }
);
TimelineThumb.displayName = 'TimelineThumb';
