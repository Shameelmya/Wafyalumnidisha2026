"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';

export default function FramePage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [frameType, setFrameType] = useState<'none' | 'PTR' | 'LSC'>('none');
  
  // Image filters
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [temperature, setTemperature] = useState(0); 

  const [showEdit, setShowEdit] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setFrameType('none');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (exportRef.current) {
      const canvas = await html2canvas(exportRef.current, {
        scale: 4, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Framed_Photo.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (exportRef.current && navigator.share) {
      const canvas = await html2canvas(exportRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `Framed_Photo.png`, { type: 'image/png' });
          try {
            await navigator.share({
              title: 'DISHA 2026',
              text: 'Check out my DISHA 2026 framed photo!',
              files: [file]
            });
          } catch (err) {
            console.error('Share failed', err);
          }
        }
      });
    } else {
      alert("Sharing is not supported on this device/browser.");
    }
  };

  const getFilterStyle = () => {
    let filters = `contrast(${contrast}%) saturate(${saturation}%) brightness(${brightness}%)`;
    if (temperature > 0) {
      filters += ` sepia(${temperature}%) hue-rotate(-${temperature / 2}deg)`;
    } else if (temperature < 0) {
      const coolVal = Math.abs(temperature);
      filters += ` hue-rotate(${coolVal / 2}deg) sepia(${coolVal / 2}%) saturate(${100 + coolVal}%)`;
    }
    return filters;
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', marginBottom: '24px' }}>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>&larr; Back Home</Link>
      </div>

      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>Photo Framing</h1>

      {!photo ? (
        <div className="glass" style={{ width: '100%', padding: '40px 20px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ marginBottom: '16px', color: 'var(--primary)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <p style={{ marginBottom: '24px', color: 'var(--secondary-text)' }}>Upload a photo to get started</p>
          <label className="btn-primary" style={{ padding: '16px 24px', display: 'inline-block', cursor: 'pointer' }}>
            Upload Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </label>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Always show Preview Area first once photo is uploaded */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div 
              ref={exportRef}
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '500px', 
                aspectRatio: frameType === 'PTR' ? '4/5' : frameType === 'LSC' ? '4/3' : '1/1',
                overflow: 'hidden',
                background: '#ccc'
              }}
            >
              {/* User Photo */}
              <img 
                src={photo} 
                alt="User photo" 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: getFilterStyle()
                }} 
              />
              
              {/* Frame Overlay */}
              {frameType !== 'none' && (
                <img 
                  src={frameType === 'PTR' ? '/PTR.png' : '/LSC.png'} 
                  alt="Frame" 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    objectPosition: 'bottom',
                    pointerEvents: 'none'
                  }} 
                />
              )}
            </div>

            {/* Quick change frame button overlay */}
            {frameType !== 'none' && (
              <button 
                onClick={() => setFrameType(frameType === 'PTR' ? 'LSC' : 'PTR')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                Change to {frameType === 'PTR' ? 'Landscape' : 'Portrait'}
              </button>
            )}
          </div>

          {/* Controls */}
          {frameType === 'none' ? (
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '16px' }}>Select Frame Type</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setFrameType('PTR')} className="btn-primary" style={{ flex: 1 }}>Portrait</button>
                <button onClick={() => setFrameType('LSC')} className="btn-primary" style={{ flex: 1 }}>Landscape</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button onClick={() => setShowEdit(!showEdit)} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {showEdit ? 'Hide Edit' : 'Edit Photo'}
                </span>
              </button>
              <button onClick={handleDownload} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download
                </span>
              </button>
              <button onClick={handleShare} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  Share
                </span>
              </button>
            </div>
          )}

          {/* Edit Panel */}
          {showEdit && frameType !== 'none' && (
            <div className="glass animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Adjust Photo</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Temperature</span>
                    <span>{temperature > 0 ? '+' : ''}{temperature}</span>
                  </div>
                  <input type="range" min="-50" max="50" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          )}

          

        </div>
      )}
    </div>
  );
}
