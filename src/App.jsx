import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vdfolmjeqfaegfwitjtr.supabase.co',
  'sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8'
)

function App() {
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [thumb, setThumb] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user?? null))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user?? null))
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
  }

  // OPTION 1: Email Login - NO GOOGLE NEEDED
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Account बन गया! अब Login करो')
  }
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // OPTION 2: Upload
  const uploadVideo = async () => {
    if (!file ||!title) return alert('Title और Video डालो!')
    setUploading(true)
    try {
      const videoName = `${user.id}/${Date.now()}_${file.name}`
      await supabase.storage.from('videos').upload(videoName, file)
      const { data: videoData } = supabase.storage.from('videos').getPublicUrl(videoName)

      let thumbUrl = null
      if (thumb) {
        const thumbName = `${user.id}/${Date.now()}_${thumb.name}`
        await supabase.storage.from('thumbnails').upload(thumbName, thumb)
        const { data } = supabase.storage.from('thumbnails').getPublicUrl(thumbName)
        thumbUrl = data.publicUrl
      }

      await supabase.from('videos').insert({
        user_id: user.id,
        title,
        description: title,
        video_url: videoData.publicUrl,
        thumbnail_url: thumbUrl,
      })
      await supabase.from('profiles').upsert({ id: user.id, username: email })

      setTitle(''); setFile(null); setThumb(null)
      fetchVideos()
      alert('Upload हो गया! 🔥')
    } catch (e) { alert(e.message) }
    setUploading(false)
  }

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#ff0000' }}>ClipTube - 2 Options 🔥</h1>

      <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>OPTION 1: Email Login (No Google)</h2>
        {!user? (
          <div>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', color:'black' }} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', color:'black' }} />
            <br />
            <button onClick={signUp} style={{ padding: '10px 20px', background: '#333', color: 'white', borderRadius: '20px', marginRight: '10px' }}>Sign Up</button>
            <button onClick={signIn} style={{ padding: '10px 20px', background: 'white', color: 'black', borderRadius: '20px' }}>Login</button>
          </div>
        ) : (
          <div>
            <p>✅ Login: {user.email}</p>
            <button onClick={logout} style={{ padding: '8px 15px', background: '#333', color: 'white', borderRadius: '10px' }}>Logout</button>
          </div>
        )}
      </div>

      <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px' }}>
        <h2>OPTION 2: Upload + Feed</h2>
        {user? (
          <div style={{ marginBottom: '20px', background: '#1f1f1f', padding: '15px', borderRadius: '10px' }}>
            <input placeholder="Video Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', color:'black' }} />
            <p>Video File:</p>
            <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
            <p>Thumbnail:</p>
            <input type="file" accept="image/*" onChange={e => setThumb(e.target.files[0])} />
            <br /><br />
            <button onClick={uploadVideo} disabled={uploading} style={{ padding: '10px 20px', background: 'red', color: 'white', borderRadius: '20px' }}>{uploading? 'Uploading...' : 'Upload Video'}</button>
          </div>
        ) : <p>Upload के लिए Login करो</p>}

        <h3>All Videos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#1f1f1f', borderRadius: '10px', overflow: 'hidden' }}>
              <video src={v.video_url} poster={v.thumbnail_url} controls style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ padding: '10px' }}><b>{v.title}</b></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default App