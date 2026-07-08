import { useState, useRef, useMemo } from 'react'
import ReactPlayer from 'react-player'
import {
  TimelineRoot,
  TimelineTrack,
  TimelineThumb,
  TimelineHeatmap,
  TimelineBuffer,
  TimelinePreview,
  TimelineMarker,
  TimelineChapter
} from '../../src/index'
import './App.css'

const generateHeatmapData = () => {
  const data = [];
  let current = 0.3;
  for (let i = 0; i < 100; i++) {
    current += (Math.random() - 0.5) * 0.15;
    current = Math.max(0.05, Math.min(1.0, current));
    // Simulate high retention in the middle
    if (i > 45 && i < 55) {
      current += 0.4;
      current = Math.min(1, current);
    }
    // Dropoff at the end
    if (i > 85) {
      current -= 0.2;
      current = Math.max(0.05, current);
    }
    data.push(current);
  }
  return data;
}

const CHAPTERS = [
  { id: 'ch1', value: 20, title: 'Introduction', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80' },
  { id: 'ch2', value: 50, title: 'Deep Dive into React', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80' },
  { id: 'ch3', value: 80, title: 'Final Conclusion', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80' }
];

const MARKERS = [
  { id: 'm1', value: 10, label: '🔖 Intro highlight' },
  { id: 'm2', value: 65, label: '🔥 Most replayed' }
];

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function App() {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [duration, setDuration] = useState(0)
  
  const [standaloneProgress, setStandaloneProgress] = useState(30)
  const [standaloneScrubbing, setStandaloneScrubbing] = useState(false)
  
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [showChapters, setShowChapters] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  
  const playerRef = useRef<ReactPlayer>(null)
  
  const heatmapData = useMemo(() => generateHeatmapData(), [])

  const handleSeek = (value: number) => {
    setProgress(value)
  }

  const handleSeekCommit = (value: number) => {
    setProgress(value)
    setIsScrubbing(false)
    if (playerRef.current) {
      playerRef.current.seekTo(value / 100, 'fraction')
    }
  }

  const handleProgress = (state: { played: number, loaded: number }) => {
    setLoaded(state.loaded * 100)
    if (!isScrubbing) {
      setProgress(state.played * 100)
    }
  }

  const currentTime = (progress / 100) * duration;
  
  // Reusable heatmap bar: colour intensity scales with the retention value,
  // so hot spots glow red while quiet parts stay faint.
  const renderHeatmapBar = (val: number, i: number) => {
    const intensity = Math.min(1, Math.max(0.05, val));
    return (
      <div
        key={i}
        className="heatmap-bar"
        style={{
          flex: 1,
          height: `${Math.max(6, val * 100)}%`,
          background: `linear-gradient(to top, rgba(255, 75, 43, ${0.85 * intensity}), rgba(255, 65, 108, ${0.2 * intensity}))`,
        }}
      />
    );
  };

  // Reusable render logic for the beautiful popup
  const renderBeautifulPopup = (val: number, currentDuration: number = 600) => {
    const timeStr = formatTime((val / 100) * currentDuration);
    const hoveredChapter = CHAPTERS.find(c => Math.abs(c.value - val) < 2.5);
    
    if (hoveredChapter) {
      return (
        <div className="chapter-popup">
          <img src={hoveredChapter.thumbnail} alt={hoveredChapter.title} className="chapter-thumbnail" />
          <div className="chapter-popup-content">
            <div className="chapter-popup-title">{hoveredChapter.title}</div>
            <div className="chapter-popup-time">{timeStr}</div>
          </div>
        </div>
      )
    }
    return <div className="timeline-preview-simple">{timeStr}</div>;
  };

  return (
    <>
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-logo">media-timeline-primitives</div>
        <a href="https://github.com/Mekterz/media-timeline-primitives" className="nav-github" target="_blank" rel="noopener noreferrer">
           GitHub
        </a>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Build <span className="text-gradient">premium</span> media experiences.
          </h1>
          <p className="hero-subtitle">
            Unstyled, fully accessible headless React primitives to build advanced media timelines (Smart Scrubbers, Heatmaps, Chapters).
          </p>

          <div className="standalone-demo">
            <div className="standalone-header">
              <h3 className="standalone-title">Sandbox (Interactive)</h3>
              <div className="toggles-container">
                <label className="toggle-label">
                  <input type="checkbox" checked={showHeatmap} onChange={e => setShowHeatmap(e.target.checked)} />
                  Heatmap
                </label>
                <label className="toggle-label">
                  <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
                  Tooltip
                </label>
                <label className="toggle-label">
                  <input type="checkbox" checked={showChapters} onChange={e => setShowChapters(e.target.checked)} />
                  Chapters
                </label>
                <label className="toggle-label">
                  <input type="checkbox" checked={showMarkers} onChange={e => setShowMarkers(e.target.checked)} />
                  Markers
                </label>
              </div>
            </div>

            <TimelineRoot
              className={`timeline-root ${standaloneScrubbing ? 'is-scrubbing' : ''}`}
              value={standaloneProgress}
              onValueChange={setStandaloneProgress}
              onPointerDown={() => setStandaloneScrubbing(true)}
              onValueCommit={() => setStandaloneScrubbing(false)}
              min={0}
              max={100}
              step={1}
            >
              {showPreview && (
                <TimelinePreview 
                  className="timeline-preview-container" 
                  render={(val) => renderBeautifulPopup(val, 600 /* fake duration of 10 minutes */)} 
                />
              )}
              
              {showHeatmap && (
                <TimelineHeatmap
                  data={heatmapData}
                  className="timeline-heatmap"
                  renderBar={renderHeatmapBar}
                />
              )}
              
              <TimelineTrack className="timeline-track">
                <TimelineBuffer value={60} className="timeline-buffer" />
                <div className="timeline-fill" style={{ width: `${standaloneProgress}%` }} />
                
                {showChapters && CHAPTERS.map(ch => (
                  <TimelineChapter key={ch.id} value={ch.value} className="timeline-chapter" />
                ))}
              </TimelineTrack>
              
              {showMarkers && MARKERS.map(m => (
                <TimelineMarker key={m.id} value={m.value} className="timeline-marker">
                  <div className="marker-tooltip">{m.label}</div>
                </TimelineMarker>
              ))}
              
              <TimelineThumb className="timeline-thumb" />
            </TimelineRoot>
          </div>
        </div>

        <div className="hero-visual">
          <div className={`player-wrapper ${isScrubbing ? 'scrubbing' : ''}`}>
            <ReactPlayer 
              ref={playerRef}
              url="template.mp4" 
              playing={playing}
              onProgress={handleProgress}
              onDuration={setDuration}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              controls={false}
              config={{
                youtube: {
                  playerVars: { showinfo: 0, rel: 0, modestbranding: 1 }
                }
              }}
            />

            <div className="player-overlay">
              <TimelineRoot
                className={`timeline-root ${isScrubbing ? 'is-scrubbing' : ''}`}
                value={progress}
                onValueChange={handleSeek}
                onValueCommit={handleSeekCommit}
                onPointerDown={() => setIsScrubbing(true)}
                min={0}
                max={100}
                step={0.5}
              >
                <TimelinePreview 
                  className="timeline-preview-container" 
                  render={(val) => renderBeautifulPopup(val, duration)} 
                />

                <TimelineHeatmap
                  data={heatmapData}
                  className="timeline-heatmap"
                  renderBar={renderHeatmapBar}
                />

                <TimelineTrack className="timeline-track">
                  <TimelineBuffer value={loaded} className="timeline-buffer" />
                  <div className="timeline-fill" style={{ width: `${progress}%` }} />
                  
                  {CHAPTERS.map(ch => (
                    <TimelineChapter key={ch.id} value={ch.value} className="timeline-chapter" />
                  ))}
                </TimelineTrack>

                {MARKERS.map(m => (
                  <TimelineMarker key={m.id} value={m.value} className="timeline-marker">
                    <div className="marker-tooltip">{m.label}</div>
                  </TimelineMarker>
                ))}

                <TimelineThumb className="timeline-thumb" />
              </TimelineRoot>

              <div className="controls-bar">
                <button className="play-btn" onClick={() => setPlaying(!playing)}>
                  {playing ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Documentation Section */}
      <section className="docs-section">
        <h2>Documentation</h2>
        <div className="docs-grid">
          <div className="doc-card">
            <h3>Installation</h3>
            <p>Install the primitives via your favorite package manager. Bring your own CSS and video player.</p>
            <pre><code>npm install media-timeline-primitives</code></pre>
          </div>

          <div className="doc-card">
            <h3>Basic Usage</h3>
            <p>Link the timeline to your media player (e.g. <code>react-player</code>) using standard React state.</p>
            <pre><code>{`import { 
  TimelineRoot, 
  TimelineTrack, 
  TimelineThumb 
} from 'media-timeline-primitives'

function Player() {
  const [progress, setProgress] = useState(0)
  
  return (
    <TimelineRoot 
      value={progress} 
      onValueChange={setProgress} 
      max={100}
    >
      <TimelineTrack>
        <div style={{ width: \`\${progress}%\` }} />
      </TimelineTrack>
      <TimelineThumb />
    </TimelineRoot>
  )
}`}</code></pre>
          </div>

          <div className="doc-card">
            <h3>Advanced Composition</h3>
            <p>Add Heatmaps, Previews, Chapters, or Markers. Map over your arrays to inject chapters dynamically.</p>
            <pre><code>{`import { 
  TimelineHeatmap, 
  TimelineChapter, 
  TimelinePreview,
  TimelineBuffer
} from 'media-timeline-primitives'

<TimelineRoot value={progress} max={100}>
  {/* Add a beautiful snapping hover preview */}
  <TimelinePreview render={(val) => <Tooltip value={val} />} />
  
  {/* Add a retention curve either by passing an array... */}
  <TimelineHeatmap data={[0.2, 0.8, 0.5, 0.9]} />
  
  {/* ...or by fetching directly from a URL (e.g. GitHub Gist or your own server) */}
  {/* <TimelineHeatmap dataUrl="https://your-server.com/heatmap.json" /> */}
  
  <TimelineTrack>
    <TimelineBuffer value={loadedPercentage} />
    <div style={{ width: \`\${progress}%\` }} />
    
    {/* Map your video chapters */}
    {chapters.map(ch => (
      <TimelineChapter key={ch.id} value={ch.percentage} />
    ))}
  </TimelineTrack>
</TimelineRoot>`}</code></pre>
          </div>

          <div className="doc-card">
            <h3>🎨 Customization (CSS & Styles)</h3>
            <p>Because the components are <strong>headless</strong>, they don't force any specific design. You have full control over the CSS.</p>
            <ul>
              <li>Use the provided classes like <code>.timeline-root</code>, <code>.timeline-track</code>, or pass your own <code>className</code>.</li>
              <li>Use the <code>renderBar</code> prop on the Heatmap to draw custom shapes or gradients based on data intensity.</li>
              <li>Pass custom nodes as children to markers or chapters to create custom tooltips.</li>
            </ul>
          </div>

          <div className="doc-card">
            <h3>🔌 Backend & Analytics Integration</h3>
            <p>To create a dynamic heatmap (audience retention), you need to record video progress and store it on a backend.</p>
            <ul>
              <li><strong>Record</strong>: Use your player's <code>onProgress</code> event to count which seconds are watched.</li>
              <li><strong>Store</strong>: Send this array to a secure backend database (like <strong>Supabase</strong>, <strong>Firebase</strong>, or a custom Node.js server).</li>
              <li><strong>Avoid Frontend Secrets</strong>: Never use services like GitHub Gists directly from the frontend if they require a secret Token, as your visitors could steal it!</li>
              <li><strong>Fetch</strong>: Use the <code>dataUrl</code> prop on the heatmap to automatically fetch the JSON array from your secure API.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    {/* Animated Wave Background at the bottom */}
    <div className="wave-container">
      <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="rgba(255, 65, 108, 0.15)" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,122.7C672,128,768,192,864,224C960,256,1056,256,1152,229.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path fill="rgba(255, 75, 43, 0.1)" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,133.3C672,128,768,128,864,138.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
    </>
  )
}

export default App
