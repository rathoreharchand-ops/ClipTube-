import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [currentTab, setCurrentTab] = useState('login');
  const [session, setSession] = useState(null);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // फॉर्म स्टेट्स
  const [clipTitle, setClipTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  
  // ऑथेंटिकेशन स्टेट्स
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // सेशन और वीडियो लोड करना
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setCurrentTab('feed');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && currentTab === 'login') setCurrentTab('feed');
    });

    fetchVideos();

    // सीक्रेट ओनर पैनल चेक (?owner=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('owner') === 'true') {
      setCurrentTab('owner');
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error('वीडियो लोड करने में त्रुटि:', err.message);
    }
  };

  // ईमेल लॉगिन या साइनअप
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('सफलतापूर्वक अकाउंट बन गया! अब लॉगिन करें।');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setCurrentTab('feed');
      }
    } catch (err) {
      alert('एरर: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentTab('login');
  };

  // वीडियो अपलोड करना
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('कृपया वीडियो फाइल चुनें!');
      return;
    }

    try {
      setUploading(true);
      const fileName = `${Date.now()}_${videoFile.name.replace(/\s+/g, '_')}`;

      // 1. Storage में अपलोड
      const { error: storageError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile);
      if (storageError) throw storageError;

      // 2. पब्लिक यूआरएल पाना
      const { data: publicURLData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // 3. डेटाबेस में सेव करना
      const { error: dbError } = await supabase
        .from('videos')
        .insert([{ 
          title: clipTitle || 'Untitled Clip', 
          video_url: publicURLData.publicUrl,
          user_id: session?.user?.id 
        }]);

      if (dbError) throw dbError;

      alert('वीडियो सफलतापूर्वक अपलोड हो गया!');
      setClipTitle('');
      setVideoFile(null);
      fetchVideos();
      setCurrentTab('feed');
    } catch (err) {
      alert('अपलोड फेल हो गया: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ---- 1. LOGIN / SIGNUP SCREEN ----
  if (currentTab === 'login' && !session) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🔗 ClipTube Business</h2>
          <p style={{ color: '#aaa', fontSize: '13px' }}>इंस्टाग्राम जैसा प्रोफेशनल शॉर्ट-वीडियो प्लेटफॉर्म</p>
          
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <input
              type="email"
              placeholder="ईमेल आईडी (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="पासवर्ड (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.primaryBtn}>
              {isSignUp ? 'अकाउंट बनाएं (Sign Up)' : 'लॉगिन करें (Login)'}
            </button>
          </form>

          <p onClick={() => setIsSignUp(!isSignUp)} style={styles.toggleText}>
            {isSignUp ? 'पहले से अकाउंट है? लॉगिन करें' : 'नया अकाउंट बनाएं? Sign Up'}
          </p>
        </div>
      </div>
    );
  }

  // ---- 2. CREATE SCREEN ----
  if (currentTab === 'create') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3>नया वीडियो अपलोड करें</h3>
          <span onClick={() => setCurrentTab('feed')} style={{ cursor: 'pointer' }}>✕</span>
        </div>
        <div style={{ padding: '15px', flex: 1 }}>
          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '15px' }}>
              <label style={styles.label}>वीडियो फाइल चुनें (Gallery / Camera)</label>
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} style={styles.input} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={styles.label}>वीडियो का शीर्षक (Title)</label>
              <input
                type="text"
                placeholder="जैसे: Sunset vibes..."
                value={clipTitle}
                onChange={(e) => setClipTitle(e.target.value)}
                style={styles.input}
              />
            </div>
            <button type="submit" disabled={uploading} style={styles.primaryBtn}>
              {uploading ? 'अपलोड हो रहा है...' : 'Share Clip'}
            </button>
          </form>
        </div>
        {renderBottomNav('create', setCurrentTab)}
      </div>
    );
  }

  // ---- 3. PROFILE SCREEN ----
  if (currentTab === 'profile') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span>{session?.user?.email}</span>
          <span onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff4444' }}>लॉग आउट</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={styles.avatar}>👤</div>
          <h3>प्रोफाइल डैशबोर्ड</h3>
          <p style={{ color: '#aaa' }}>कुल पोस्ट्स: {videos.length}</p>
        </div>
        {renderBottomNav('profile', setCurrentTab)}
      </div>
    );
  }

  // ---- 4. SECRET OWNER PANEL ----
  if (currentTab === 'owner') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3>👑 Business Owner Panel</h3>
          <span onClick={() => setCurrentTab('feed')} style={{ cursor: 'pointer' }}>Exit</span>
        </div>
        <div style={{ padding: '15px' }}>
          <div style={{ background: '#1a1a24', padding: '15px', borderRadius: '8px' }}>
            <p>🟢 <strong>System Status:</strong> Operational</p>
            <p>📊 <strong>Total Videos in DB:</strong> {videos.length}</p>
            <p>💰 <strong>AdMob Monetization:</strong> Active (Ready)</p>
          </div>
          <button onClick={fetchVideos} style={{ ...styles.primaryBtn, marginTop: '15px' }}>डेटा रिफ्रेश करें</button>
        </div>
      </div>
    );
  }

  // ---- 5. HOME FEED SCREEN ----
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, color: '#ff007f' }}>ClipTube</h2>
        <div>🔍 🔔 💬</div>
      </div>

      <div style={{ padding: '10px', flex: 1, overflowY: 'auto' }}>
        {videos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>अभी कोई वीडियो उपलब्ध नहीं है।</p>
        ) : (
          videos.map((vid) => (
            <div key={vid.id} style={styles.videoCard}>
              <div style={styles.cardHeader}>👤 @creator</div>
              <video src={vid.video_url} controls style={styles.videoElement} />
              <div style={{ padding: '10px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>{vid.title}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {renderBottomNav('home', setCurrentTab)}
    </div>
  );
}

function renderBottomNav(activeTab, setCurrentTab) {
  return (
    <div style={styles.bottomNav}>
      <span onClick={() => setCurrentTab('feed')} style={{ cursor: 'pointer' }}>🏠 Home</span>
      <span onClick={() => setCurrentTab('create')} style={{ cursor: 'pointer', background: '#ff007f', padding: '6px 12px', borderRadius: '8px', color: '#fff' }}>+ Create</span>
      <span onClick={() => setCurrentTab('profile')} style={{ cursor: 'pointer' }}>👤 Profile</span>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0c0c12',
    color: '#fff',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    paddingBottom: '60px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    background: '#14141c',
    borderBottom: '1px solid #222'
  },
  card: {
    padding: '30px 20px',
    textAlign: 'center',
    marginTop: '50px'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: '#1a1a24',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    boxSizing: 'border-box'
  },
  primaryBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(45deg, #ff007f, #7928ca)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  toggleText: { color: '#0095f6', fontSize: '13px', marginTop: '15px', cursor: 'pointer' },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    height: '55px',
    background: '#14141c',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #222'
  },
  videoCard: {
    background: '#14141c',
    borderRadius: '10px',
    marginBottom: '15px',
    overflow: 'hidden'
  },
  cardHeader: { padding: '10px', fontSize: '13px', fontWeight: 'bold' },
  videoElement: { width: '100%', maxHeight: '350px', background: '#000' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', background: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  label: { display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }
};
