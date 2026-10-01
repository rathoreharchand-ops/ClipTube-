import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://xdyjxgmihtzobpndgqbn.supabase.co",
  "sb_publishable_YL9rS0H9rS0Q6X1L9p0H9rS0Q6X1L9p0H9rS0Q"
)

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [videos, setVideos] = useState([])
  const [msg, setMsg] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>{ if(data.session) setUser(data.session.user) })
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', {ascending:false})
    if(data) setVideos(data)
  }

  const handleSignup = async () => {
    if(!email ||!password) return alert("Email Password डालो")
    const {error} = await supabase.auth.signUp({email, password})
    if(error) alert(error.message)
    else { alert("ID बन गई! अब Login करो"); setEmail(""); setPassword("") }
  }

  const handleLogin = async () => {
    if(!email ||!password) return alert("Email Password डालो")
    const {data, error} = await supabase.auth.signInWithPassword({email, password})
    if(error) alert("Login Fail: "+error.message)
    else { setUser(data.user); fetchVideos() }
  }

  const handleUpload = async () => {
    if(!title) return alert("शीर्षक लिखो!")
    if(!file) return alert("फाइल चुनो!")
    setMsg("Upload हो रहा है...")
    const fileName = Date.now()+"-"+file.name
    const {error: upError} = await supabase.storage.from('videos').upload(fileName, file)
    if(upError){ setMsg(""); return alert("Upload Error: "+upError.message) }
    const {data} = supabase.storage.from('videos').getPublicUrl(fileName)
    const url = data.publicUrl
    const {error: dbError} = await supabase.from('videos').insert({title: title, video_url: url, user_email: user.email})
    if(dbError){ setMsg(""); return alert("DB Error: "+dbError.message) }
    setMsg("Upload Done!"); setTitle(""); setFile(null); fetchVideos()
    setTimeout(()=>setMsg(""), 2000)
  }

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:"20px"}}>
      <h2 style={{color:"red"}}>ClipTube - ईमेल लॉगिन 🔒</h2>
      {!user? (
        <div>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:"10px", width:"90%", margin:"5px"}}/><br/>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:"10px", width:"90%", margin:"5px"}}/><br/>
          <button onClick={handleLogin} style={{padding:"10px", background:"red", color:"white", margin:"5px"}}>लॉग इन करें</button>
          <button onClick={handleSignup} style={{padding:"10px", background:"white", color:"black", margin:"5px"}}>नया Account बनाओ</button>
        </div>
      ) : (
        <div>
          <p>✅ लॉगिन: {user.email} <button onClick={async()=>{await supabase.auth.signOut(); setUser(null)}}>लॉग आउट</button></p>
          <div style={{border:"1px solid #333", padding:"15px", marginTop:"10px"}}>
            <h3>वीडियो अपलोड</h3>
            <input placeholder="शीर्षक" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:"10px", width:"90%", margin:"5px"}}/><br/>
            <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{margin:"10px"}}/><br/>
            <button onClick={handleUpload} style={{padding:"10px 20px", background:"red", color:"white", borderRadius:"20px"}}>अपलोड करें</button>
            <p>{msg}</p>
          </div>
          <h3 style={{marginTop:"20px"}}>सभी वीडियो ({videos.length})</h3>
          {videos.map(v=>(
            <div key={v.id} style={{border:"1px solid #333", margin:"10px 0", padding:"10px"}}>
              <p><b>{v.title}</b> - {v.user_email}</p>
              <video src={v.video_url} controls style={{width:"100%", maxHeight:"300px"}}></video>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default App