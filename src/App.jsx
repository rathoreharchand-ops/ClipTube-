import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://vdfolmjexqfaegfwitjtr.supabase.co",
  "sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8"
)

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState({ live: true, download: true, messenger: true, like: true, share: true, comment: true })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setUser(data.session.user)
    }).catch(()=>{})

    // Safe fetch - error आये तो ignore
    fetchVideos().catch(()=>{})
    loadFeatures().catch(()=>{})
  }, [])

  const loadFeatures = async () => {
    try {
      const { data, error } = await supabase.from('app_config').select('features').eq('id', 1).maybeSingle()
      if (!error && data?.features) setFeatures(data.features)
    } catch (e) {
      console.log("app_config not ready, using default ON")
      // Default ON रखो ताकि LIVE दिखे
      setFeatures({ live: true, download: true, messenger: false, like: true, share: true, comment: true })
    }
  }

  const fetchVideos = async () => {
    try {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
      if (data) setVideos(data)
    } catch (e) {}
  }

  const handleSignup = async () => {
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert("Signup हो गया! अब Login करो")
    } catch (e) { alert("Failed to fetch - Supabase URL/Key Check करो") }
  }

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else setUser(data.user)
    } catch (e) {
      alert("Network Error: Supabase में Table नहीं बनी है! पहले SQL Run करो")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleUpload = async () => {
    if (!file ||!title) return alert("Title और File दो!")
    setLoading(true)
    try {
      const fileName = Date.now() + "_" + file.name
      const { error: upErr } = await supabase.storage.from('videos').upload(fileName, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName)
      await supabase.from('videos').insert([{ title, video_url: urlData.publicUrl, user_id: user.id }])
      setTitle(""); setFile(null); fetchVideos()
      alert("Upload हो गया! ✅")
    } catch (e) { alert(e.message) }
    setLoading(false)
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'white', padding: 20 }}>
        <div style={{ background: '#222', padding: 30, borderRadius: 15, width: '100%', maxWidth: 360 }}>
          <h2 style={{ textAlign: 'center' }}>▶️ ClipTube</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 12, margin: '8px 0', borderRadius: 8, border: 'none' }} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 12, margin: '8px 0', borderRadius: 8, border: 'none' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: 12, background: '#ff0050', color: 'white', border: 'none', borderRadius: 8, marginTop: 10, fontWeight: 'bold' }}>लॉग इन कर</button>
          <button onClick={handleSignup} style={{ width: '100%', padding: 12, background: '#333', color: 'white', border: 'none', borderRadius: 8, marginTop: 10 }}>साइन अप करें</button>
          <p style={{ fontSize: 11, marginTop: 15, color: '#aaa', textAlign: 'center' }}>अगर Failed to fetch आये तो Supabase में SQL Run करो</p>
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
        <input placeholder="Video Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#2a2a2a', color: 'white', marginBottom: 10 }} />
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ width: '100%', marginBottom: 10, color: 'white' }} />
        <button onClick={handleUpload} disabled={loading} style={{ width: '100%', padding: 12, background: '#ff0050', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>{loading? 'Uploading...' : 'Upload Video'}</button>
      </div>
      <div style={{ padding: 10 }}>
        {videos.map((v, i) => (
          <div key={i} style={{ background: '#1a1a1a', borderRadius: 12, marginBottom: 15, overflow: 'hidden' }}>
            <video src={v.video_url} controls style={{ width: '100%', background: 'black' }} />
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: '0 0 8px 0' }}>{v.title}</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {features.like && <button style={{ background: '#2a2a2a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>👍 Like</button>}
                {features.share && <button style={{ background: '#2a2a2a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>↗️ Share</button>}
                {features.download && <button style={{ background: '#00c853', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 20 }}>⬇️ Download</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App