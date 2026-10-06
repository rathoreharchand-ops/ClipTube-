import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [videos, setVideos] = useState([
    { id: 1, title: 'पहला शॉर्ट वीडियो', url: 'https://www.w3schools.com/html/mov_bbb.mp4', likes: 10, comments: 2, user: 'राजेश' },
    { id: 2, title: 'राजस्थानी शेड सोंग शॉर्ट', url: 'https://www.w3schools.com/html/movie.mp4', likes: 25, comments: 5, user: 'अमित' }
  ]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  // वीडियो अपलोड करने का फंक्शन
  const handleUpload = (e) => {
    e.preventDefault();
    if (!videoTitle) {
      alert('कृपया वीडियो का शीर्षक (Title) लिखें!');
      return;
    }
    const newVideo = {
      id: Date.now(),
      title: videoTitle,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // यहाँ असली वीडियो यूआरएल जुड़ेगा
      likes: 0,
      comments: 0,
      user: 'मेरी प्रोफाइल'
    };
    setVideos([newVideo, ...videos]);
    setVideoTitle('');
    setCurrentTab('home');
    alert('वीडियो सफलतापूर्वक अपलोड हो गया!');
  };

  // अगर यूजर लॉगिन नहीं है
  if (!isLoggedIn) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '360px', background: '#181818', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid #333' }}>
          <h1 style={{ color: '#ff0000', marginBottom: '10px' }}>Cliptube</h1>
          <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '25px' }}>इंस्टाग्राम और यूट्यूब जैसा शॉर्ट वीडियो ऐप</p>
          <input type="text" placeholder="मोबाइल नंबर या ईमेल दर्ज करें" style={{ width: '100%', padding: '14px', marginBottom: '15px', background: '#121212', border: '1px solid #444', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
          <button onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '14px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            लॉगिन / साइन अप करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '70px', maxWidth: '480px', margin: '0 auto' }}>
      
      {/* टॉप हेडर */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #222', position: 'sticky', top: 0, background: '#000', zIndex: 10 }}>
        <h2 style={{ margin: 0, color: '#ff0000', fontSize: '20px' }}>Cliptube</h2>
        <div style={{ fontSize: '18px' }}>🔍 💬</div>
      </div>

      {/* होम टैब: शॉर्ट्स/रील्स फीड */}
      {currentTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '15px' }}>
          {videos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>कोई वीडियो उपलब्ध नहीं है।</p>
          ) : (
            videos.map((vid) => (
              <div key={vid.id} style={{ width: '100%', height: '75vh', background: '#111', borderRadius: '16px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222' }}>
                <video src={vid.url} controls autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* वीडियो की जानकारी नीचे */}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '70px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>@{vid.user}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#ddd' }}>{vid.title}</p>
                </div>

                {/* दाईं तरफ एक्शन बटन (Like, Comment, Share) */}
                <div style={{ position: 'absolute', right: '15px', bottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '24px' }}>❤️</span>
                    <div style={{ fontSize: '12px' }}>{vid.likes}</div>
                  </div>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '24px' }}>💬</span>
                    <div style={{ fontSize: '12px' }}>{vid.comments}</div>
                  </div>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '24px' }}>↗️</span>
                    <div style={{ fontSize: '12px' }}>शेयर</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* अपलोड टैब */}
      {currentTab === 'upload' && (
        <div style={{ padding: '25px' }}>
          <h3>नया वीडियो अपलोड करें</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'cap', gap: '15px', marginTop: '20px' }}>
            <input 
              type="text" 
              placeholder="वीडियो का शीर्षक या विवरण लिखें..." 
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              style={{ width: '100%', padding: '14px', background: '#181818', border: '1px solid #444', color: '#fff', borderRadius: '8px' }}
            />
            <input 
              type="file" 
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              style={{ width: '100%', padding: '12px', background: '#181818', border: '1px solid #444', color: '#fff', borderRadius: '8px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              वीडियो पब्लिश करें
            </button>
          </form>
        </div>
      )}

      {/* प्रोफाइल टैब */}
      {currentTab === 'profile' && (
        <div style={{ padding: '25px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '50%', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
            👤
          </div>
          <h3>मेरी प्रोफाइल</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>rathoreharchand@gmail.com</p>
          <div style={{ marginTop: '30px', borderTop: '1px solid #222', paddingTop: '20px' }}>
            <p style={{ color: '#777' }}>आपके द्वारा अपलोड किए गए वीडियो यहाँ दिखेंगे।</p>
          </div>
        </div>
      )}

      {/* नीचे का नेविगेशन बार (Instagram / YouTube Shorts Style Bottom Bar) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#121212', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #222', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <span onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer', textAlign: 'center', color: currentTab === 'home' ? '#ff0000' : '#888', fontSize: '14px' }}>
          🏠<br/>होम फीड
        </span>
        <span onClick={() => setCurrentTab('upload')} style={{ cursor: 'pointer', textAlign: 'center', color: currentTab === 'upload' ? '#ff0000' : '#888', fontSize: '14px' }}>
          ➕<br/>अपलोड
        </span>
        <span onClick={() => setCurrentTab('profile')} style={{ cursor: 'pointer', textAlign: 'center', color: currentTab === 'profile' ? '#ff0000' : '#888', fontSize: '14px' }}>
          👤<br/>प्रोफाइल
        </span>
      </div>

    </div>
  );
}
