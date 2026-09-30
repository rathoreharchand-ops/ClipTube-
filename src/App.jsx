import { useState } from 'react'

function App() {
  const [search, setSearch] = useState('')
  const [videos, setVideos] = useState([
    {id:'dQw4w9WgXcQ', title:'React Tutorial for Beginners', channel:'Code with Harchand'},
    {id:'kJQP7kiw5Fk', title:'Learn JavaScript in 1 Hour', channel:'ClipTube Official'},
    {id:'9bZkp7q19f0', title:'Vite + React Full Project', channel:'Harchand Rathore'},
  ])
  const [selected, setSelected] = useState(null)

  return (
    <div style={{background:'#0f0f0f', minHeight:'100vh', color:'white', fontFamily:'Roboto'}}>
      <div style={{display:'flex', gap:'10px', padding:'15px', background:'#212121', position:'sticky', top:0}}>
        <h2 style={{margin:0, color:'red'}}>▶ ClipTube</h2>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" style={{flex:1, padding:'10px', borderRadius:'20px', border:'none', background:'#121212', color:'white'}}/>
      </div>

      <div style={{display:'flex', flexWrap:'wrap'}}>
        <div style={{flex:2, minWidth:'300px', padding:'15px'}}>
          {selected ? (
            <>
              <iframe width="100%" height="350" src={`https://www.youtube.com/embed/${selected.id}`} frameBorder="0" allowFullScreen></iframe>
              <h2>{selected.title}</h2>
              <p>{selected.channel}</p>
              <button onClick={()=>setSelected(null)} style={{padding:'8px 15px', background:'red', color:'white', border:'none', borderRadius:'5px'}}>Back</button>
            </>
          ) : (
            <h2>Trending Videos 🔥</h2>
          )}
        </div>

        <div style={{flex:1, minWidth:'300px', padding:'10px', display:'grid', gap:'10px'}}>
          {videos.filter(v=>v.title.toLowerCase().includes(search.toLowerCase())).map(v=>(
            <div key={v.id} onClick={()=>setSelected(v)} style={{cursor:'pointer', background:'#212121', borderRadius:'10px', overflow:'hidden'}}>
              <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} style={{width:'100%'}}/>
              <div style={{padding:'8px'}}>
                <b>{v.title}</b>
                <p style={{color:'#aaa', fontSize:'13px'}}>{v.channel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default App
