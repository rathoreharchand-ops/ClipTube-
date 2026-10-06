import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  // ऐप शुरू होते ही डेटाबेस से सारे वीडियो लोड करने के लिए
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideoList(data || []);
    } catch (error) {
      console.error('वीडियो लोड करने में एरर:', error.message);
    }
  };

  // वीडियो अपलोड करने का फंक्शन
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('कृपया पहले कोई वीडियो चुनें!');
      return;
    }

    try {
      setUploading(true);
      const fileName = `${Date.now()}_${videoFile.name}`;

      // 1. Supabase Storage में वीडियो अपलोड करें (बकेट का नाम 'videos' होना चाहिए)
      const { data: storageData, error: storageError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile);

      if (storageError) throw storageError;

      // 2. अपलोड किए गए वीडियो का पब्लिक URL निकालें
      const { data: publicURLData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      const videoUrl = publicURLData.publicUrl;

      // 3. डेटाबेस टेबल ('videos') में वीडियो का लिंक और नाम सेव करें
      const { error: dbError } = await supabase
        .from('videos')
        .insert([{ title: title || 'बिना नाम का वीडियो', url: videoUrl }]);

      if (dbError) throw dbError;

      alert('वीडियो सफलतापूर्वक अपलोड हो गया!');
      setTitle('');
      setVideoFile(null);
      fetchVideos(); // लिस्ट को रिफ्रेश करें
    } catch (error) {
      console.error('अपलोड करने में समस्या:', error.message);
      alert('अपलोड फेल हो गया: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>मेरा वीडियो ऐप (Video App)</h2>

      {/* वीडियो अपलोड फॉर्म */}
      <form onSubmit={handleUpload} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>नया वीडियो अपलोड करें</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="वीडियो का शीर्षक (Title)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={uploading} style={{ padding: '10px 15px', background: 'green', color: 'white', border: 'none', borderRadius: '4px' }}>
          {uploading ? 'अपलोड हो रहा है...' : 'अपलोड करें'}
        </button>
      </form>

      {/* वीडियो की लिस्ट */}
      <h3>सभी वीडियो</h3>
      {videoList.length === 0 ? (
        <p>अभी कोई वीडियो अपलोड नहीं किया गया है।</p>
      ) : (
        videoList.map((vid) => (
          <div key={vid.id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <h4>{vid.title}</h4>
            <video width="100%" controls style={{ borderRadius: '4px' }}>
              <source src={vid.url} type="video/mp4" />
              आपका ब्राउज़र वीडियो टैग को सपोर्ट नहीं करता।
            </video>
          </div>
        ))
      )}
    </div>
  );
}
