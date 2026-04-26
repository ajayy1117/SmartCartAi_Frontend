import React, { useState, useRef } from 'react';

export default function CameraSearch({ onVisualResults }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      await performVisualSearch(base64String);
    };
    reader.readAsDataURL(file);
  };

  const performVisualSearch = async (base64Image) => {
    try {
      setIsUploading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/image-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        onVisualResults(data.results);
      }
    } catch (err) {
      console.error("Visual search failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-upload-wrap">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button 
        type="button" 
        className={`img-search-btn ${isUploading ? 'loading' : ''}`}
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
        title="Search by image"
      >
        <span className="img-icon">{isUploading ? '⌛' : '📷'}</span>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .image-upload-wrap {
          display: flex;
          align-items: center;
        }
        .img-search-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
          color: var(--text);
        }
        .img-search-btn:hover {
          background: rgba(255,255,255,0.05);
          transform: scale(1.1);
        }
        .img-search-btn.loading {
          animation: spin 1s linear infinite;
          opacity: 0.7;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
