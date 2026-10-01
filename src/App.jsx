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
  const [mode, setMode] = useState('login') // login, signup, forgot
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user?? null))
    supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user?? null))
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', {ascending: false})
    if(data) setVideos(data)
  }

  const handleSignUp = async () => {
    if(!email ||!password) return alert('Email और Password डालो')
    if(password.length < 6) return alert('Password 6 अक्षर से ज्यादा रखो')
    const { error } = await supabase.auth.signUp({ email, password })
    if(error) alert(error.message)
    else { alert('✅ ID बन गई! अब Login करो'), setMode('login') }
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(error) alert('Login Fail: ' + error.message)
  }

  const handleForgot = async () => {
    if(!email) return alert('Email डालो')
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://clip-tube-chi.vercel.app' })
    if(error) alert(error.message)
    else alert('📧 Email पर Password Reset Link भेजा गया! Inbox देखो')
  }

  const logout = async () => { await supabase.auth.signOut(); setUser(null) }

  const uploadVideo = async () => {
    if(!file ||!title) return alert('Title और Video डालो')
    setUploading(true)
    try {
      const name = `${user.id}/${Date.now()}_${file.name}`
      await supabase.storage.from('videos').upload(name, file)
      const { data } = supabase.storage.from('videos').getPublicUrl(name)
      await supabase.from('videos').insert({ user_id: user.id, title, video_url: data.publicUrl })
      setTitle(''); setFile(null); fetchVideos(); alert('Upload Done! 🔥')
    } catch(e){ alert(e.message) }
    setUploading(false)
  }

  return (
    <div style={{background:'#0f0f0f', minHeight:'100vh', color:'white', padding:'20px', fontFamily:'sans-serif'}}>
      <h1 style={{color:'#ff0000'}}>ClipTube - Email Login 🔒</h1>
      <p style={{fontSize:'12px', color:'#aaa'}}>एक Email = एक ID Permanent | Password भूल गए तो Email से Reset</p>

      <div style={{border:'1px solid #333', padding:'20px', borderRadius:'12px', marginBottom:'20px', maxWidth:'400px'}}>
        {!user? (
          <>
            {mode==='login' && <>
              <h3>Email से Login</h3>
              <input placeholder="Email जैसे ram@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', color:'black', marginBottom:'10px'}}/>
              <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', color:'black', marginBottom:'10px'}}/>
              <button onClick={handleLogin} style={{width:'100%', padding:'12px', background:'red', color:'white', borderRadius:'25px', fontWeight:'bold'}}>Login करें</button>
              <p style={{marginTop:'15px', fontSize:'14px'}}><span onClick={()=>setMode('signup')} style={{color:'#3ea6ff', cursor:'pointer'}}>नया Account बनाओ</span> | <span onClick={()=>{setMode('forgot')}} style={{color:'#3ea6ff', cursor:'pointer'}}>Password भूल गए?</span></p>
            </>}
            {mode==='signup' && <>
              <h3>नया Account - Email से</h3>
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', color:'black', marginBottom:'10px'}}/>
              <input type="password" placeholder="Password बनाओ (6+ अक्षर)" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', color:'black', marginBottom:'10px'}}/>
              <button onClick={handleSignUp} style={{width:'100%', padding:'12px', background:'white', color:'black', borderRadius:'25px', fontWeight:'bold'}}>ID बनाओ</button>
              <p onClick={()=>setMode('login')} style={{color:'#3ea6ff', cursor:'pointer', marginTop:'10px'}}>Login पर वापस</p>
            </>}
            {mode==='forgot' && <>
              <h3>Password Reset</h3>
              <input placeholder="अपना Email डालो" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', color:'black', marginBottom:'10px'}}/>
              <button onClick={handleForgot} style={{width:'100%', padding:'12px', background:'white', color:'black', borderRadius:'25px'}}>Reset Link भेजो</button>
              <p onClick={()=>setMode('login')} style={{color:'#3ea6ff', cursor:'pointer', marginTop:'10px'}}>Login पर वापस</p>
            </>}
          </>
        ) : (
          <div>
            <p>✅ Login: {user.email}</p>
            <button onClick={logout} style={{padding:'8px 15px', background:'#333', color:'white', borderRadius:'10px'}}>Logout</button>
          </div>
        )}
      </div>

      <div style={{border:'1px solid #333', padding:'15px', borderRadius:'10px'}}>
        <h2>Videos</h2>
        {user? <div style={{marginBottom:'15px', background:'#1f1f1f', padding:'15px', borderRadius:'10px', maxWidth:'400px'}}><input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'5px', color:'black', marginBottom:'10px'}}/><input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])}/><br/><br/><button onClick={uploadVideo} disabled={uploading} style={{padding:'10px 20px', background:'red', color:'white', borderRadius:'20px'}}>{uploading?'Uploading...':'Upload'}</button></div> : <p>Upload के लिए Login करो</p>}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px,1fr))', gap:'15px'}}>{videos.map(v=> (<div key={v.id} style={{background:'#1f1f1f', borderRadius:'10px', overflow:'hidden'}}><video src={v.video_url} controls style={{width:'100%', height:'150px'}}/><div style={{padding:'10px'}}><b>{v.title}</b></div></div>))}</div>
      </div>
    </div>
  )
}
export default App