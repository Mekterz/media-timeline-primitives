import React, { useState, useEffect } from 'react';

export interface TimelineHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: number[];
  dataUrl?: string;
  renderBar?: (value: number, index: number) => React.ReactNode;
}

export const TimelineHeatmap = React.forwardRef<HTMLDivElement, TimelineHeatmapProps>(
  ({ data: initialData = [], dataUrl, renderBar, style, ...props }, forwardedRef) => {
    const [fetchedData, setFetchedData] = useState<number[]>([]);

    useEffect(() => {
      if (dataUrl) {
        fetch(dataUrl)
          .then(res => res.json())
          .then(json => {
            if (Array.isArray(json)) setFetchedData(json);
          })
          .catch(err => console.error('Failed to fetch heatmap data:', err));
      }
    }, [dataUrl]);

    const displayData = dataUrl ? (fetchedData.length > 0 ? fetchedData : initialData) : initialData;

    return (
      <div
        ref={forwardedRef}
        style={{
          // Headless: only own horizontal span + bar layout.
          // Vertical placement (bottom/height) is left to the consumer's CSS
          // so it can sit flush on top of the track instead of overlapping it.
          position: 'absolute',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'flex-end',
          ...style,
        }}
        {...props}
      >
        {displayData.map((val, i) => (
          renderBar ? renderBar(val, i) : (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${val * 100}%`,
                backgroundColor: 'currentColor',
                opacity: 0.2,
              }}
            />
          )
        ))}
      </div>
    );
  }
);
TimelineHeatmap.displayName = 'TimelineHeatmap';
