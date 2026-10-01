import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vdfolmjeqfaegfwitjtr.supabase.co',
  'sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8'
)

function App() {
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
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

  // OPTION 1: PHONE OTP LOGIN
  const sendOtp = async () => {
    if (!phone) return alert('Mobile Number डालो! +91 के साथ, जैसे +919876543210')
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) alert(error.message)
    else {
      setOtpSent(true)
      alert('OTP भेज दिया! (Supabase Dashboard -> Authentication -> Users में OTP देख सकते हो अगर SMS Setup नहीं है)')
    }
  }

  const verifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    if (error) alert(error.message)
    else alert('Login हो गया! 🔥')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setOtpSent(false)
  }

  // OPTION 2: Upload
  const uploadVideo = async () => {
    if (!file ||!title) return alert('Title और Video डालो!')
    setUploading(true)
    try {
      const videoName = `${user.id}/${Date.now()}_${file.name}`
      await supabase.storage.from('videos').upload(videoName, file)
      const { data: videoData } = supabase.storage.from('videos').getPublicUrl(videoName)
      await supabase.from('videos').insert({
        user_id: user.id,
        title,
        video_url: videoData.publicUrl,
      })
      setTitle(''); setFile(null)
      fetchVideos()
      alert('Upload हो गया!')
    } catch (e) { alert(e.message) }
    setUploading(false)
  }

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#ff0000' }}>ClipTube - Mobile OTP 🔥</h1>

      <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>OPTION 1: Mobile OTP Login</h2>
        {!user? (
          <div>
            {!otpSent? (
              <>
                <input placeholder="+919876543210" value={phone} onChange={e=>setPhone(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'black', marginBottom: '10px' }} />
                <button onClick={sendOtp} style={{ padding: '12px 25px', background: 'white', color: 'black', borderRadius: '25px', fontWeight: 'bold' }}>OTP भेजो</button>
                <p style={{fontSize:'12px', color:'#aaa', marginTop:'10px'}}>+91 के साथ पूरा नंबर डालो</p>
              </>
            ) : (
              <>
                <p>OTP {phone} पर भेजा गया</p>
                <input placeholder="6 Digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'black', marginBottom: '10px' }} />
                <button onClick={verifyOtp} style={{ padding: '12px 25px', background: 'red', color: 'white', borderRadius: '25px', fontWeight: 'bold', marginRight:'10px' }}>Verify OTP</button>
                <button onClick={()=>setOtpSent(false)} style={{ padding: '12px 20px', background: '#333', color: 'white', borderRadius: '25px' }}>Back</button>
              </>
            )}
          </div>
        ) : (
          <div>
            <p>✅ Login: {user.phone || user.id}</p>
            <button onClick={logout} style={{ padding: '8px 15px', background: '#333', color: 'white', borderRadius: '10px' }}>Logout</button>
          </div>
        )}
      </div>

      <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px' }}>
        <h2>OPTION 2: Upload + Feed</h2>
        {user? (
          <div style={{ marginBottom: '20px', background: '#1f1f1f', padding: '15px', borderRadius: '10px' }}>
            <input placeholder="Video Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', color:'black' }} />
            <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
            <br /><br />
            <button onClick={uploadVideo} disabled={uploading} style={{ padding: '10px 20px', background: 'red', color: 'white', borderRadius: '20px' }}>{uploading? 'Uploading...' : 'Upload Video'}</button>
          </div>
        ) : <p>Upload के लिए Mobile OTP से Login करो</p>}

        <h3>All Videos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#1f1f1f', borderRadius: '10px', overflow: 'hidden' }}>
              <video src={v.video_url} controls style={{ width: '100%', height: '150px' }} />
              <div style={{ padding: '10px' }}><b>{v.title}</b></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default App