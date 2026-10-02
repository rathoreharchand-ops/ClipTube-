import { useState, useEffect } from 'react'
const SUPA_URL = "https://vdfolmjexqfaegfwitjtr.supabase.co"
const SUPA_KEY = "sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8"

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [videos, setVideos] = useState([])
  const [tab, setTab] = useState("home")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('ct_user')
    if (s) setUser(JSON.parse(s))
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/videos?select=*&order=created_at.desc`, {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
      })
      const d = await r.json()
      if (Array.isArray(d)) setVideos(d)
    } catch (e) {}
  }

  const login = () => {
    if (!email) return alert("Email डालो")
    const u = { id: email.replace(/[^a-z0-9]/g, '_'), email }
    localStorage.setItem('ct_user', JSON.stringify(u))
    setUser(u)
  }

  const upload = async () => {
    if (!file ||!title) return alert("Title और File दोनों चुनो")
    setLoading(true)
    try {
      const name = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`

      // सीधा Upload - Library नहीं
      const up = await fetch(`${SUPA_URL}/storage/v1/object/videos/${name}`, {
        method: 'POST',
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, 'x-upsert': 'true' },
        body: file
      })
      if (!up.ok) {
        const t = await up.text()
        throw new Error("Upload Fail: " + t)
      }

      const publicUrl = `${SUPA_URL}/storage/v1/object/public/videos/${name}`

      await fetch(`${SUPA_URL}/rest/v1/videos`, {
        method: 'POST',
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ title, video_url: publicUrl, user_id: user.id, user_email: user.email })
      })

      setTitle(""); setFile(null)
      await loadVideos()
      setTab("profile")
      alert("✅ Upload हो गया!")
    } catch (e) {
      alert(e.message)
    }
    setLoading(false)
  }

  if (!user) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111',color:'white',padding:20}}>
      <div style={{background:'#222',padding:30,borderRadius:15,width:360}}>
        <h2 style={{textAlign:'center'}}>ClipTube</h2>
        <input placeholder="Email डालो" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'none',marginTop:10}}/>
        <button onClick={login} style={{width:'100%',padding:12,background:'#ff0050',color:'white',border:'none',borderRadius:8,marginTop:10,fontWeight:'bold'}}>Login</button>
      </div>
    </div>
  }

  const my = videos.filter(v => v.user_id === user.id)
  const list = tab === "home"? videos : my

  return <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',paddingBottom:80}}>
    <div style={{padding:12,background:'#1a1a1a',display:'flex',justifyContent:'space-between',position:'sticky',top:0}}><b>क्लिपट्यूब</b><span style={{fontSize:10}}>{user.email}</span></div>
    <div style={{padding:15,background:'#1a1a1a',margin:10,borderRadius:12}}>
      <input placeholder="टाइटल" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'none',background:'#2a2a2a',color:'white',marginBottom:8}}/>
      <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:8,color:'white'}}/>
      <button onClick={upload} disabled={loading} style={{width:'100%',padding:10,background:'#ff0050',color:'white',border:'none',borderRadius:8}}>{loading?"Uploading...":"Upload करो"}</button>
    </div>
    <div style={{padding:10}}>
      <b>{tab==="home"?`होम - सबकी (${videos.length})`:`प्रोफ़ाइल - मेरी (${my.length})`}</b>
      {list.length===0 && <div style={{textAlign:'center',color:'#777',marginTop:30}}>कोई वीडियो नहीं - पहली Upload करो!</div>}
      {list.map((v,i)=><div key={i} style={{background:'#1a1a1a',borderRadius:12,marginTop:12,overflow:'hidden'}}>
        <video src={v.video_url} controls style={{width:'100%'}}/>
        <div style={{padding:10}}><b>{v.title}</b><div style={{fontSize:11,color:'#888'}}>{v.user_email}</div></div>
      </div>)}
    </div>
    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#1a1a1a',display:'flex',borderTop:'1px solid #333'}}>
      <button onClick={()=>setTab("home")} style={{flex:1,padding:14,background:tab==="home"?'#333':'transparent',color:'white',border:'none'}}>🏠 होम<br/><span style={{fontSize:10}}>सबकी</span></button>
      <button onClick={()=>setTab("profile")} style={{flex:1,padding:14,background:tab==="profile"?'#333':'transparent',color:'white',border:'none'}}>👤 प्रोफ़ाइल<br/><span style={{fontSize:10}}>मेरी {my.length}</span></button>
      <button onClick={()=>{localStorage.removeItem('ct_user');setUser(null)}} style={{flex:1,padding:14,background:'transparent',color:'#f55',border:'none'}}>🚪 लॉगआउट</button>
    </div>
  </div>
}