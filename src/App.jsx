import React, { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [videos, setVideos] = useState([
    { 
      id: 1, 
      title: 'Golden hour at the beach 🌅 just soaking in the sunset calm waves and warm breeze #sunset #beachlife #summervibes #ocean', 
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', 
      likes: '15.2K', 
      comments: '890', 
      user: 'summer_vibes',
      song: 'original sound — summer.vibes'
    },
    { 
      id: 2, 
      title: 'Late night dance flow ✨ #dance #trending #clip #foryou', 
      url: 'https://www.w3schools.com/html/movie.mp4', 
      likes: '24.3K', 
      comments: '1.2K', 
      user: 'luna.dance',
      song: 'original sound — luna.dance'
    }
  ]);
  
  const [clipName, setClipName] = useState('');
  const [clipDesc, setClipDesc] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!clipName) {
      alert('कृपया क्लिप का नाम दर्ज करें!');
      return;
    }
    const newVideo = {
      id: Date.now(),
      title: `${clipName} ${clipDesc}`,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: '0',
      comments: '0',
      user: 'harchand_rathore',
      song: 'original audio'
    };
    setVideos([newVideo, ...videos]);
    setClipName('');
    setClipDesc('');
    setCurrentTab('home');
    alert('क्लिप सफलतापूर्वक अपलोड हो गई!');
  };

  // 1. लॉगिन स्क्रीन (डिफ़ोर्स्ड डिज़ाइन)
  if (!isLoggedIn) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #1a0b2e, #0a0512)', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔗</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>ClipTube</h1>
          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '40px' }}>Welcome to ClipTube<br/><span style={{ fontSize: '12px', color: '#777' }}>Login to continue</span></p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              📞 Continue with Mobile Number
            </button>
            <button onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              ✉️ Continue with Email ID
            </button>
            <button onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              🌐 Continue with Google
            </button>
          </div>
          
          <p style={{ fontSize: '11px', color: '#777', marginTop: '30px' }}>
            By continuing you agree to our <span style={{ color: '#ff77ff', textDecoration: 'underline' }}>Terms of Service</span> and <span style={{ color: '#ff77ff', textDecoration: 'underline' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0512', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '70px', maxWidth: '480px', margin: '0 auto' }}>
      
      {/* होम टैब */}
      {currentTab === 'home' && (
        <div>
          {/* टॉप हेडर */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', position: 'sticky', top: 0, background: '#0a0512', zIndex: 10 }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>ClipTube</h2>
            <div style={{ display: 'flex', gap: '15px', fontSize: '18px' }}>
              <span>🔍</span>
              <span>🔔</span>
              <span>💬</span>
            </div>
          </div>

          {/* स्टोरीज़ / स्टेटस बार */}
          <div style={{ display: 'flex', gap: '12px', padding: '10px 15px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ textAlign: 'center', minWidth: '60px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#222', border: '2px solid #ff44aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>➕</div>
              <span style={{ fontSize: '11px', color: '#aaa' }}>Your Story</span>
            </div>
            {['maya', 'jordan', 'zoe', 'leo', 'kari'].map((name, idx) => (
              <div key={idx} style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff007f, #7f00ff)', padding: '2px' }}>
                  <div style={{ width: '100%', height: '100%', background: '#333', borderRadius: '50%' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: '#aaa' }}>{name}</span>
              </div>
            ))}
          </div>

          {/* रील्स / शॉर्ट्स वीडियो फीड */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '15px' }}>
            {videos.map((vid) => (
              <div key={vid.id} style={{ width: '100%', height: '72vh', background: '#111', borderRadius: '20px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <video src={vid.url} controls autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* यूज़र और विवरण नीचे */}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '70px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#444' }}></div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>@{vid.user}</span>
                    <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', cursor: 'pointer' }}>Follow</button>
                  </div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#eee', lineHeight: '1.4' }}>{vid.title}</p>
                  <div style={{ fontSize: '12px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🎵 {vid.song}
                  </div>
                </div>

                {/* दाईं तरफ एक्शन बटन (Like, Comment, Share) */}
                <div style={{ position: 'absolute', right: '15px', bottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: '26px' }}>❤️</div>
                    <div style={{ fontSize: '11px', color: '#fff' }}>{vid.likes}</div>
                  </div>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: '26px' }}>💬</div>
                    <div style={{ fontSize: '11px', color: '#fff' }}>{vid.comments}</div>
                  </div>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: '26px' }}>↗️</div>
                    <div style={{ fontSize: '11px', color: '#fff' }}>Share</div>
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', border: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                    💿
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* अपलोड टैब (New Clip Screen) */}
      {currentTab === 'upload' && (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>New Clip</h2>
            <span onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer', fontSize: '18px', background: '#222', padding: '5px 10px', borderRadius: '50%' }}>✕</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              📁<br/><span style={{ fontSize: '12px' }}>Gallery</span>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              📹<br/><span style={{ fontSize: '12px' }}>Camera</span>
            </div>
          </div>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Clip Name</label>
              <input 
                type="text" 
                placeholder="Summer Beach Sunset" 
                value={clipName}
                onChange={(e) => setClipName(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Title / Description</label>
              <input 
                type="text" 
                placeholder="Catching the sunset vibes at the beach..." 
                value={clipDesc}
                onChange={(e) => setClipDesc(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #ff007f, #7f00ff)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Share Clip
            </button>
          </form>
        </div>
      )}

      {/* प्रोफाइल टैब */}
      {currentTab === 'profile' && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>@harchand_rathore</h3>
          <div style={{ width: '90px', height: '90px', background: 'linear-gradient(45deg, #ff007f, #7f00ff)', borderRadius: '50%', margin: '0 auto 15px auto', padding: '3px' }}>
            <div style={{ width: '100%', height: '100%', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>👨‍💻</div>
          </div>
          <h2 style={{ fontSize: '18px', margin: '5px 0' }}>Harchand Rathore</h2>
          <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 30px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', margin: '15px 0' }}>
            Edit Profile
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px 0' }}>
            <div><strong>48</strong><br/><span style={{ fontSize: '12px', color: '#888' }}>Posts</span></div>
            <div><strong>12.5K</strong><br/><span style={{ fontSize: '12px', color: '#888' }}>Followers</span></div>
            <div><strong>340</strong><br/><span style={{ fontSize: '12px', color: '#888' }}>Following</span></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '15px' }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} style={{ height: '120px', background: '#222', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '5px', left: '5px', fontSize: '10px', color: '#ccc' }}>👁️️ 2.3M views</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* नीचे का नेविगेशन बार */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0a0512', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <span onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer', textAlign: 'center', color: currentTab === 'home' ? '#ff44aa' : '#888', fontSize: '12px' }}>
          🏠<br/>Home
        </span>
        <span onClick={() => setCurrentTab('upload')} style={{ cursor: 'pointer', textAlign: 'center', color: currentTab === 'upload' ? '#ff44aa' : '#888', fontSize: '12px' }}>
          <span style={{ background: 'linear-gradient(135deg, #ff007f, #7f00ff)', padding: '6px 14px', borderRadius: '12px', color: '#fff', fontSize: '16px', display: 'inline-block' }}>+</span><br/>Create
        </span>
        <span onClick={() => setCurrentTab('profile')} style={{ cursor: 'pointer', textAlign: 'center', color: currentTab === 'profile' ? '#ff44aa' : '#888', fontSize: '12px' }}>
          👤<br/>Profile
        </span>
      </div>

    </div>
  );
}
