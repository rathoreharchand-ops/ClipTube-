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
  const [tab, setTab] = useState("home") // home = सभी, profile = मेरी
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>{
      if(data.session) setUser(data.session.user)
    })
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const {data} = await supabase.from('videos').select('*').order('created_at',{ascending:false})
    if(data) setVideos(data)
  }

  const handleLogin = async () => {
    const {data, error} = await supabase.auth.signInWithPassword({email,password})
    if(error) alert(error.message)
    else setUser(data.user)
  }
  const handleSignup = async () => {
    const {error} = await supabase.auth.signUp({email,password})
    if(error) alert(error.message)
    else alert("Signup हो गया! अब Login करो")
  }

  const handleUpload = async () => {
    if(!file ||!title) return alert("Title और Video चुनो!")
    setLoading(true)
    try{
      const fileName = `${user.id}/${Date.now()}_${file.name}`
      const {error:upErr} = await supabase.storage.from('videos').upload(fileName, file)
      if(upErr) throw upErr
      const {data:urlData} = supabase.storage.from('videos').getPublicUrl(fileName)
      await supabase.from('videos').insert([{
        title, video_url:urlData.publicUrl,
        user_id:user.id, user_email:user.email
      }])
      setTitle(""); setFile(null)
      fetchVideos()
      setTab("profile")
      alert("✅ Upload हो गया! Profile में देखो")
    }catch(e){ alert(e.message) }
    setLoading(false)
  }

  const myVideos = videos.filter(v=>v.user_id===user?.id)
  const displayVideos = tab==="profile"? myVideos : videos

  if(!user){
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111',color:'white',padding:20}}>
        <div style={{background:'#222',padding:30,borderRadius:15,width:'100%',maxWidth:360}}>
          <h2 style={{textAlign:'center'}}>▶️ ClipTube</h2>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12,margin:'8px 0',borderRadius:8,border:'none'}} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:12,margin:'8px 0',borderRadius:8,border:'none'}} />
          <button onClick={handleLogin} style={{width:'100%',padding:12,background:'#ff0050',color:'white',border:'none',borderRadius:8,marginTop:10,fontWeight:'bold'}}>लॉग इन कर</button>
          <button onClick={handleSignup} style={{width:'100%',padding:12,background:'#333',color:'white',border:'none',borderRadius:8,marginTop:10}}>साइन अप करें</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',paddingBottom:70}}>
      {/* Header */}
      <div style={{padding:'12px 15px',background:'#1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:10}}>
        <h3 style={{margin:0}}>▶️ ClipTube {tab==="home"?" - Home":" - Profile"}</h3>
        <span style={{fontSize:12,color:'#aaa'}}>{user.email}</span>
      </div>

      {/* Upload Box - सिर्फ Profile में या Home में भी दिखाओ */}
      <div style={{padding:15,background:'#1a1a1a',margin:10,borderRadius:12}}>
        <input placeholder="Video Title लिखो..." value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'none',background:'#2a2a2a',color:'white',marginBottom:10}} />
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:10,color:'white'}} />
        <button onClick={handleUpload} disabled={loading} style={{width:'100%',padding:12,background:'#ff0050',color:'white',border:'none',borderRadius:8,fontWeight:'bold'}}>{loading?'Uploading...':'Upload करो'}</button>
      </div>

      {/* Videos List */}
      <div style={{padding:10}}>
        <h4 style={{margin:'0 0 10px 5px'}}>{tab==="home"? `🌍 सभी की Videos (${videos.length})` : `👤 मेरी Profile की Videos (${myVideos.length})`}</h4>
        {displayVideos.length===0 && <p style={{textAlign:'center',color:'#666',marginTop:30}}>{tab==="home"?"अभी कोई Video नहीं":"तुमने अभी कोई Video Upload नहीं की"}</p>}
        {displayVideos.map((v,i)=>(
          <div key={i} style={{background:'#1a1a1a',borderRadius:12,marginBottom:15,overflow:'hidden',border: v.user_id===user.id? '1px solid #ff0050': 'none'}}>
            <video src={v.video_url} controls style={{width:'100%',background:'black',maxHeight:450}} />
            <div style={{padding:12}}>
              <h4 style={{margin:'0 0 4px 0'}}>{v.title}</h4>
              <p style={{margin:0,fontSize:11,color: v.user_id===user.id? '#ff0050':'#888'}}>
                {v.user_email} {v.user_id===user.id? "• मेरी Video":""}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Tabs - Instagram जैसा */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#1a1a1a',display:'flex',borderTop:'1px solid #333'}}>
        <button onClick={()=>setTab("home")} style={{flex:1,padding:14,background:tab==="home"?'#222':'transparent',color:'white',border:'none',fontWeight:tab==="home"?'bold':'normal'}}>
          🏠 Home<br/><span style={{fontSize:11}}>सबकी Videos</span>
        </button>
        <button onClick={()=>setTab("profile")} style={{flex:1,padding:14,background:tab==="profile"?'#222':'transparent',color:'white',border:'none',fontWeight:tab==="profile"?'bold':'normal'}}>
          👤 Profile<br/><span style={{fontSize:11}}>मेरी ({myVideos.length})</span>
        </button>
        <button onClick={()=>supabase.auth.signOut().then(()=>setUser(null))} style={{flex:1,padding:14,background:'transparent',color:'#ff5555',border:'none'}}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
export default App