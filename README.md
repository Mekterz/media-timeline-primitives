# media-timeline-primitives

[![npm version](https://badge.fury.io/js/media-timeline-primitives.svg)](https://badge.fury.io/js/media-timeline-primitives)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> Build premium, accessible, and highly-customizable media experiences.

**`media-timeline-primitives`** is a set of **headless React components** that let you build advanced media timelines (like YouTube or Netflix) without being locked into a specific design or video player.

**[View the Live Interactive Demo](https://mekterz.github.io/media-timeline-primitives/)**

---

## Features

- **Headless & Unstyled**: Bring your own CSS. We handle the complex math, dragging logic, and state.
- **Player Agnostic**: Works flawlessly with `<video>`, `react-player`, or any custom video engine.
- **Advanced Components**: 
  - **Heatmaps**: Display audience retention curves.
  - **Chapters**: Add markers for different video sections.
  - **Previews**: Show tooltips or thumbnail previews while hovering over the timeline.
  - **Markers**: Highlight important moments in the timeline.
  - **Buffer**: Show loaded/buffered progress.
- **Fully Accessible**: Keyboard navigation support out of the box.

---

## Installation

```bash
npm install media-timeline-primitives
```

---

## Quick Start

Here is a minimal example of how to connect the primitives to standard React state.

```tsx
import { useState } from 'react';
import {
  TimelineRoot,
  TimelineTrack,
  TimelineThumb
} from 'media-timeline-primitives';

export function PlayerTimeline() {
  const [progress, setProgress] = useState(0);

  return (
    <TimelineRoot
      value={progress}
      onValueChange={setProgress}
      min={0}
      max={100}
      style={{ width: '100%', height: '24px' }}
    >
      <TimelineTrack style={{ background: '#333', height: '4px', marginTop: '10px' }}>
        <div style={{ width: `${progress}%`, background: '#fff', height: '100%' }} />
      </TimelineTrack>
      <TimelineThumb style={{ width: '12px', height: '12px', background: 'red', borderRadius: '50%' }} />
    </TimelineRoot>
  );
}
```

---

## Advanced Composition

You can easily compose more advanced features. For example, to add an audience retention heatmap and a hover preview:

```tsx
import { 
  TimelineRoot,
  TimelineHeatmap, 
  TimelineChapter, 
  TimelinePreview,
  TimelineBuffer,
  TimelineTrack
} from 'media-timeline-primitives';

<TimelineRoot value={progress} max={100}>
  {/* Add a snapping hover preview popup */}
  <TimelinePreview render={(val) => <div className="tooltip">{val}</div>} />
  
  {/* Add a retention curve either by passing an array... */}
  <TimelineHeatmap data={[0.2, 0.8, 0.5, 0.9]} />
  
  <TimelineTrack>
    {/* Show buffered amount */}
    <TimelineBuffer value={loadedPercentage} />
    <div style={{ width: `${progress}%` }} />
    
    {/* Map your video chapters dynamically */}
    {chapters.map(ch => (
      <TimelineChapter key={ch.id} value={ch.percentage} />
    ))}
  </TimelineTrack>
</TimelineRoot>
```

---

## Analytics & Backend Integration

To power the **Heatmap** dynamically based on real audience data:
1. **Record Data**: Listen to your video player's `onProgress` event and record which seconds are watched.
2. **Send to Backend**: Send this data to a secure backend database (e.g. Supabase, Firebase, Node.js).
3. **Fetch & Display**: Pass the data directly into the `<TimelineHeatmap data={myData} />`.

> **Security Warning**: Never store backend secrets or tokens directly in your frontend code (like a static React app on GitHub Pages). Use a proper secure backend to act as an intermediary for API calls.

---

## Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page](https://github.com/Mekterz/media-timeline-primitives/issues).

## License

This project is [MIT](LICENSE) licensed.
