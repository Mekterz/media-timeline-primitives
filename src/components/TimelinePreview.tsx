import React from 'react';
import { useTimelineContext } from './context';

export interface TimelinePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: (value: number) => React.ReactNode;
}

export const TimelinePreview = React.forwardRef<HTMLDivElement, TimelinePreviewProps>(
  ({ style, children, render, ...props }, forwardedRef) => {
    const { hoverValue, min, max } = useTimelineContext();

    if (hoverValue === null) return null;

    const percentage = Math.max(0, Math.min(100, ((hoverValue - min) / (max - min)) * 100));

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
      >
        {render ? render(hoverValue) : children}
      </div>
    );
  }
);
TimelinePreview.displayName = 'TimelinePreview';
