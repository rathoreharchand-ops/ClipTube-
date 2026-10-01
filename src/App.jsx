import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://vdfolmjeqfaegfwitjtr.supabase.co",
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (!error && data) setVideos(data)
  }

  const handleSignup = async () => {
    if (!email ||!password) return alert("Email Password डालो")
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert("ID बन गई! अब लॉग इन करो")
  }

  const handleLogin = async () => {
    if (!email ||!password) return alert("Email Password डालो")
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else { setUser(data.user); fetchVideos() }
  }

  const handleUpload = async () => {
    if (!title) return alert("शीर्षक लिखो!")
    if (!file) return alert("फाइल चुनो!")
    setLoading(true)
    try {
      const fileName = Date.now() + "-" + file.name
      const { error: upError } = await supabase.storage.from('videos').upload(fileName, file)
      if (upError) throw upError

      const { data } = supabase.storage.from('videos').getPublicUrl(fileName)
      const { error: dbError } = await supabase.from('videos').insert({
        title: title,
        video_url: data.publicUrl
      })
      if (dbError) throw dbError

      setTitle("")
      setFile(null)
      document.getElementById('fileInput').value = ""
      await fetchVideos()
      alert("Video Upload हो गया! ✅")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#0f0f0f", color: "white", minHeight: "100vh", padding: "15px", fontFamily: "Arial" }}>
      <h1 style={{ color: "#FF0000", textAlign: "center" }}>ClipTube 🔴</h1>

      {!user? (
        <div style={{ maxWidth: "400px", margin: "auto", background: "#212121", padding: "20px", borderRadius: "10px" }}>
          <h3>लॉगिन / नया खाता</h3>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "95%", padding: "12px", margin: "8px 0", borderRadius: "5px", border: "none" }} /><br/>
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "95%", padding: "12px", margin: "8px 0", borderRadius: "5px", border: "none" }} /><br/>
          <button onClick={handleLogin} style={{ width: "100%", padding: "12px", background: "red", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", fontSize: "16px" }}>प्रिंट इन (लॉग इन)</button>
          <button onClick={handleSignup} style={{ width: "100%", padding: "12px", background: "#3e3e3e", color: "white", border: "none", borderRadius: "5px", marginTop: "10px" }}>नया खाता</button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#212121", padding: "10px", borderRadius: "8px" }}>
            <span>✅ {user.email}</span>
            <button onClick={async () => { await supabase.auth.signOut(); setUser(null) }} style={{ background: "#3e3e3e", color: "white", border: "none", padding: "8px 15px", borderRadius: "20px" }}>लोग बाहर</button>
          </div>

          <div style={{ background: "#212121", padding: "15px", borderRadius: "10px", marginTop: "15px" }}>
            <h3>वीडियो अपलोड करें</h3>
            <input placeholder="शीर्षक लिखो..." value={title} onChange={e => setTitle(e.target.value)} style={{ width: "95%", padding: "12px", borderRadius: "5px", border: "none", color: "black" }} /><br/><br/>
            <input id="fileInput" type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} /><br/><br/>
            <button onClick={handleUpload} disabled={loading} style={{ background: "red", color: "white", border: "none", padding: "12px 25px", borderRadius: "25px", fontSize: "16px" }}>
              {loading? "अपलोड हो रहा है..." : "अपलोड करें"}
            </button>
          </div>

          <h2 style={{ marginTop: "20px" }}>वीडियो ({videos.length})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
            {videos.map(v => (
              <div key={v.id} style={{ background: "#212121", borderRadius: "10px", overflow: "hidden" }}>
                <video src={v.video_url} controls style={{ width: "100%", maxHeight: "400px", background: "black" }}></video>
                <div style={{ padding: "10px" }}>
                  <b style={{ fontSize: "18px" }}>{v.title}</b>
                  <p style={{ color: "#aaa", fontSize: "13px", margin: "5px 0 0 0" }}>{new Date(v.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {videos.length === 0 && <p style={{ color: "#888", textAlign: "center" }}>अभी कोई वीडियो नहीं है, पहला वीडियो अपलोड करो!</p>}
          </div>
        </div>
      )}
    </div>
  )
}
export default App