import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [title, setTitle] = useState("")
  const [videos, setVideos] = useState([])
  const [features, setFeatures] = useState({ live: true, download: true, like: true, share: true })

  useEffect(() => {
    const savedUser = localStorage.getItem('cliptube_user')
    if (savedUser) setUser(JSON.parse(savedUser))
    const savedVideos = localStorage.getItem('cliptube_videos')
    if (savedVideos) setVideos(JSON.parse(savedVideos))

    // Owner Panel से try करो, नहीं तो LIVE ON रखो
    try {
      fetch("https://vdfolmjexqfaegfwitjtr.supabase.co/rest/v1/app_config?id=eq.1", {
        headers: {
          "apikey": "sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8",
          "Authorization": "Bearer sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8"
        }
      }).then(r=>r.json()).then(d=>{
        if(d[0]?.features) setFeatures(d[0].features)
      }).catch(()=>{ console.log("using local live ON") })
    } catch(e) {}
  }, [])

  const handleLogin = () => {
    if (!email) return alert("Email डालो")
    const u = { email }
    setUser(u)
    localStorage.setItem('cliptube_user', JSON.stringify(u))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('cliptube_user')
  }

  const handleUpload = () => {
    if (!title) return alert("Title डालो")
    const newVideo = { id: Date.now(), title, video_url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    const updated = [newVideo,...videos]
    setVideos(updated)
    localStorage.setItem('cliptube_videos', JSON.stringify(updated))
    setTitle("")
    alert("Video Add हो गया! ✅ (Demo)")
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'white', padding: 20 }}>
        <div style={{ background: '#222', padding: 30, borderRadius: 15, width: '100%', maxWidth: 360 }}>
          <h2 style={{ textAlign: 'center' }}>▶️ ClipTube</h2>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa' }}>नया Code - बिना Failed to fetch के!</p>
          <input placeholder="Email कुछ भी लिखो" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 12, margin: '8px 0', borderRadius: 8, border: 'none' }} />
          <input placeholder="Password कुछ भी" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 12, margin: '8px 0', borderRadius: 8, border: 'none' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: 12, background: '#ff0050', color: 'white', border: 'none', borderRadius: 8, marginTop: 10, fontWeight: 'bold' }}>लॉग इन कर</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: 'white' }}>
      <div style={{ padding: '12px 15px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0 }}>
        <h3 style={{ margin: 0 }}>▶️ ClipTube {features.live && <span style={{ background: 'red', padding: '4px 10px', borderRadius: 20, fontSize: 11, marginLeft: 10 }}>🔴 LIVE</span>}</h3>
        <button onClick={handleLogout} style={{ background: '#333', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Logout</button>
      </div>

      <div style={{ padding: 15, background: '#1a1a1a', margin: 10, borderRadius: 12 }}>
        <input placeholder="Video Title लिखो" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#2a2a2a', color: 'white', marginBottom: 10 }} />
        <button onClick={handleUpload} style={{ width: '100%', padding: 12, background: '#ff0050', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>Upload Video (Demo)</button>
      </div>

      <div style={{ padding: 10 }}>
        {videos.length===0 && <p style={{textAlign:'center', color:'#666'}}>कोई Video नहीं - Upload करो!</p>}
        {videos.map((v) => (
          <div key={v.id} style={{ background: '#1a1a1a', borderRadius: 12, marginBottom: 15, overflow: 'hidden' }}>
            <video src={v.video_url} controls style={{ width: '100%', background: 'black' }} />
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: '0 0 8px 0' }}>{v.title}</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                {features.like && <button style={{ background: '#2a2a2a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>👍 Like</button>}
                {features.share && <button style={{ background: '#2a2a2a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>↗️ Share</button>}
                {features.download && <button style={{ background: '#00c853', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>⬇️ Download</button>}
                {features.live && <button style={{ background: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>🔴 LIVE देखो</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App