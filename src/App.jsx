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
  const [showMine, setShowMine] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>{
      if(data.session) setUser(data.session.user)
    })
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const {data, error} = await supabase.from('videos').select('*').order('created_at',{ascending:false})
    if(!error && data) setVideos(data)
  }

  const handleSignup = async () => {
    const {error} = await supabase.auth.signUp({email,password})
    if(error) alert(error.message)
    else alert("Signup हो गया! अब Login करो")
  }

  const handleLogin = async () => {
    const {data, error} = await supabase.auth.signInWithPassword({email,password})
    if(error) alert(error.message)
    else setUser(data.user)
  }

  const handleUpload = async () => {
    if(!file ||!title) return alert("Title और Video दोनों डालो!")
    setLoading(true)
    try{
      const fileName = `${user.id}/${Date.now()}_${file.name}`
      const {error:upErr} = await supabase.storage.from('videos').upload(fileName, file)
      if(upErr) throw upErr
      const {data:urlData} = supabase.storage.from('videos').getPublicUrl(fileName)
      const {error} = await supabase.from('videos').insert([{
        title,
        video_url: urlData.publicUrl,
        user_id: user.id,
        user_email: user.email
      }])
      if(error) throw error
      setTitle(""); setFile(null)
      fetchVideos()
      alert("✅ रियल Video Upload हो गया! अपनी प्रोफाइल में Save!")
    }catch(e){ alert(e.message) }
    setLoading(false)
  }

  const myVideosList = videos.filter(v=>v.user_id===user?.id)
  const displayVideos = showMine? myVideosList : videos

  if(!user){
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111',color:'white',padding:20}}>
        <div style={{background:'#222',padding:30,borderRadius:15,width:'100%',maxWidth:360}}>
          <h2 style={{textAlign:'center'}}>▶️ ClipTube</h2>
          <p style={{textAlign:'center',fontSize:12,color:'#aaa'}}>रियल Upload - Fix Version</p>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12,margin:'8px 0',borderRadius:8,border:'none'}} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:12,margin:'8px 0',borderRadius:8,border:'none'}} />
          <button onClick={handleLogin} style={{width:'100%',padding:12,background:'#ff0050',color:'white',border:'none',borderRadius:8,marginTop:10,fontWeight:'bold'}}>लॉग इन कर</button>
          <button onClick={handleSignup} style={{width:'100%',padding:12,background:'#333',color:'white',border:'none',borderRadius:8,marginTop:10}}>साइन अप करें</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',paddingBottom:20}}>
      <div style={{padding:'12px 15px',background:'#1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:10}}>
        <h3 style={{margin:0}}>▶️ ClipTube 🔴 LIVE</h3>
        <button onClick={()=>supabase.auth.signOut().then(()=>setUser(null))} style={{background:'#333',color:'white',border:'none',padding:'6px 10px',borderRadius:6}}>Logout</button>
      </div>

      <div style={{padding:15,background:'#1a1a1a',margin:10,borderRadius:12}}>
        <p style={{margin:'0 0 8px 0',fontSize:13}}>👤 {user.email}</p>
        <input placeholder="Video Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'none',background:'#2a2a2a',color:'white',marginBottom:10}} />
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:10,color:'white'}} />
        <button onClick={handleUpload} disabled={loading} style={{width:'100%',padding:12,background:'#ff0050',color:'white',border:'none',borderRadius:8,fontWeight:'bold'}}>{loading?'Uploading...':'रियल Upload करो'}</button>
      </div>

      <div style={{display:'flex',gap:10,padding:'0 10px',marginBottom:10}}>
        <button onClick={()=>setShowMine(true)} style={{flex:1,padding:10,background:showMine?'#ff0050':'#2a2a2a',color:'white',border:'none',borderRadius:8}}>मेरी Videos ({myVideosList.length})</button>
        <button onClick={()=>setShowMine(false)} style={{flex:1,padding:10,background:!showMine?'#ff0050':'#2a2a2a',color:'white',border:'none',borderRadius:8}}>सभी Videos ({videos.length})</button>
      </div>

      <div style={{padding:10}}>
        {displayVideos.length===0 && <p style={{textAlign:'center',color:'#666'}}>कोई Video नहीं</p>}
        {displayVideos.map((v,i)=>(
          <div key={i} style={{background:'#1a1a1a',borderRadius:12,marginBottom:15,overflow:'hidden'}}>
            <video src={v.video_url} controls style={{width:'100%',background:'black',maxHeight:400}} />
            <div style={{padding:12}}>
              <h4 style={{margin:'0 0 5px 0'}}>{v.title}</h4>
              <p style={{margin:0,fontSize:11,color:'#888'}}>{v.user_email} {v.user_id===user.id && "• मेरी"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App