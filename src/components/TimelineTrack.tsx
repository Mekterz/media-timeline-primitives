import React from 'react';
import { useTimelineContext } from './context';

export interface TimelineTrackProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineTrack = React.forwardRef<HTMLDivElement, TimelineTrackProps>(
  ({ children, style, ...props }, forwardedRef) => {
    const { trackRef } = useTimelineContext();

    const setRefs = (node: HTMLDivElement | null) => {
      (trackRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return (
      <div
        ref={setRefs}
        style={{ position: 'relative', width: '100%', ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TimelineTrack.displayName = 'TimelineTrack';
