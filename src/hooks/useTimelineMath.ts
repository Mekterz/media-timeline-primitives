import { useRef, useCallback } from 'react';

export function useTimelineMath(min: number, max: number) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const calculateValueFromPointer = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return 0;
      
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      
      return min + percentage * (max - min);
    },
    [min, max]
  );

  return { trackRef, calculateValueFromPointer };
}
