import React from 'react';
import { useTimelineContext } from './context';

export interface TimelineChapterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const TimelineChapter = React.forwardRef<HTMLDivElement, TimelineChapterProps>(
  ({ value, style, ...props }, forwardedRef) => {
    const { min, max } = useTimelineContext();
    if (value <= min) return null;

    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    return (
      <div
        ref={forwardedRef}
        style={{
          position: 'absolute',
          left: `${percentage}%`,
          transform: 'translateX(-50%)',
          bottom: 0,
          top: 0,
          zIndex: 10,
          ...style,
        }}
        {...props}
      />
    );
  }
);
TimelineChapter.displayName = 'TimelineChapter';
