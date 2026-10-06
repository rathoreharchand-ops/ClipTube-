import React, { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');

  // अगर यूजर लॉगिन नहीं है तो लॉगिन पेज दिखेगा
  if (!isLoggedIn) {
    return (
      <div style={{ background: '#0f0f0f', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '350px', background: '#212121', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#ff0000' }}>Cliptube</h2>
          <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px' }}>अपने वीडियो देखें और अपलोड करें</p>
          <input type="email" placeholder="ईमेल या मोबाइल नंबर डालें" style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#121212', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
          <button onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '12px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            लॉगिन करें (Login)
          </button>
        </div>
      </div>
    );
  }

  // लॉगिन होने के बाद मुख्य ऐप (यूट्यूब/इंस्टाग्राम जैसा फीड) दिखेगा
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
      {/* टॉप हेडर */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #222', position: 'sticky', top: 0, background: '#000', zIndex: 10 })}>
        <h3 style={{ margin: 0, color: '#ff0000' }}>Cliptube</h3>
        <div>🔍 👤</div>
      </div>

      {/* वीडियो फीड एरिया (रील्स/शॉर्ट्स स्टाइल) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
        <div style={{ width: '100%', maxWidth: '400px', height: '70vh', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}>
          <p style={{ color: '#777' }}>यहाँ वीडियो शॉर्ट्स दिखेंगे (Scrollable Feed)</p>
          {/* लाइक, कमेंट, शेयर बटन */}
          <div style={{ position: 'absolute', right: '15px', bottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '20px' }}>
            <span>❤️</span>
            <span>💬</span>
            <span>↗️</span>
          </div>
        </div>
      </div>

      {/* नीचे का नेविगेशन बार */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#121212', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #222' }}>
        <span onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer', color: currentTab === 'home' ? '#ff0000' : '#aaa' }}>🏠 होम</span>
        <span onClick={() => setCurrentTab('upload')} style={{ cursor: 'pointer', color: currentTab === 'upload' ? '#ff0000' : '#aaa' }}>➕ अपलोड</span>
        <span onClick={() => setCurrentTab('profile')} style={{ cursor: 'pointer', color: currentTab === 'profile' ? '#ff0000' : '#aaa' }}>👤 प्रोफाइल</span>
      </div>
    </div>
  );
}
