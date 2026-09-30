import { useState } from 'react'

function App() {
  const [search, setSearch] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)

  const videos = [
    { id: 'dQw4w9WgXcQ', title: 'React Tutorial - Full Course for Beginners', channel: 'Code with Harchand' },
    { id: 'Ke90Tje7VS0', title: 'Learn React in 1 Hour - Complete Guide', channel: 'Mosh Hamedani' },
    { id: 'SqcY0GlETPk', title: 'JavaScript Full Course 2024', channel: 'SuperSimpleDev' },
    { id: 'bMknfKXIFA8', title: 'Build YouTube Clone with React', channel: 'ClipTube Official' },
    { id: 'w7ejDZ8SWv8', title: 'React Hooks Explained - useState useEffect', channel: 'Web Dev Simplified' },
    { id: 'DLX62G4lc44', title: 'Learn Tailwind CSS - Zero to Hero', channel: 'Tailwind Labs' },
  ]

  const filtered = videos.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ margin: 0, fontFamily: 'Arial', background: '#0f0f0f', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: '#0f0f0f', gap: '20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 style={{ margin: 0, color: 'red' }}>▶ ClipTube</h2>
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos..."
          style={{ flex: 1, maxWidth: '600px', padding: '10px 15px', borderRadius: '20px', border: '1px solid #333', background: '#121212', color: 'white', outline: 'none' }}
        />
      </div>

      {selectedVideo ? (
        <div style={{ padding: '20px' }}>
          <button onClick={() => setSelectedVideo(null)} style={{ marginBottom: '15px', padding: '8px 15px', borderRadius: '20px', border: 'none', background: '#272727', color: 'white', cursor: 'pointer' }}>← Back</button>
          <div style={{ aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`} title={selectedVideo.title} frameBorder="0" allowFullScreen></iframe>
          </div>
          <h3 style={{ marginTop: '15px' }}>{selectedVideo.title}</h3>
          <p style={{ color: '#aaa' }}>{selectedVideo.channel}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
          {filtered.map(video => (
            <div key={video.id} onClick={() => setSelectedVideo(video)} style={{ width: '320px', cursor: 'pointer' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#222', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={video.title} />
              </div>
              <h4 style={{ margin: '8px 0 4px', fontSize: '14px', lineHeight: '18px' }}>{video.title}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>{video.channel}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
