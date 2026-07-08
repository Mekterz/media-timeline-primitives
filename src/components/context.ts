import { createContext, useContext, RefObject } from 'react';

export interface TimelineContextValue {
  value: number;
  min: number;
  max: number;
  hoverValue: number | null;
  trackRef: RefObject<HTMLDivElement | null>;
}

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export function useTimelineContext() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('Timeline components must be used within a TimelineRoot');
  }
  return context;
}
