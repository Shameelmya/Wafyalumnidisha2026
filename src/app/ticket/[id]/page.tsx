"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

function toTitleCase(str: string) {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const dummyFace = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

export default function Ticket() {
  const params = useParams();
  const phone = params.id as string;
  const router = useRouter();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [registration, setRegistration] = useState<any>(null);
  const [photo, setPhoto] = useState<string>(dummyFace);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'registrations', phone);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRegistration(docSnap.data());
          // Fetch photo from session storage
          const savedPhoto = localStorage.getItem(`photo_${phone}`) || sessionStorage.getItem(`photo_${phone}`);
          if (savedPhoto) {
            setPhoto(savedPhoto);
          }
        } else {
          setError('Entry pass not found.');
        }
      } catch (err: any) {
        console.error(err);
        setError('Error fetching ticket.');
      }
      setLoading(false);
    };
    fetchTicket();
  }, [phone]);

  const handleDownload = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 8, useCORS: true, allowTaint: true, logging: false, 
        backgroundColor: '#fafafa',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('export-ticket');
          if (el) {
            el.style.width = '340px';
            el.style.maxWidth = '340px';
          }
        }
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `EntryPass_${registration.regNumber}.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (ticketRef.current && navigator.share) {
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 8, useCORS: true, allowTaint: true, logging: false, 
        backgroundColor: '#fafafa',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('export-ticket');
          if (el) {
            el.style.width = '340px';
            el.style.maxWidth = '340px';
          }
        }
      });
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `EntryPass_${registration.regNumber}.png`, { type: 'image/png' });
          try {
            await navigator.share({
              title: 'Registration Successful',
              text: `Registration Successful!\nName: ${registration.name}\nReg No: ${registration.regNumber}\n\nHere is your entry pass for the Leaders Conclave!`,
              files: [file]
            });
          } catch (err) {
            console.error('Share failed', err);
          }
        }
      });
    } else {
      alert("Sharing is not supported on this device/browser. Please download instead.");
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>Loading entry pass...</div>;
  if (error) return <div className="container" style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--danger)' }}>{error}</div>;
  if (!registration) return null;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '32px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={() => router.push('/')} style={{ background: 'transparent', color: 'var(--primary-alt)', fontWeight: '600', marginBottom: '24px', fontSize: '1rem', padding: '0', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>
        &larr; Home
      </button>

      <h2 style={{ color: 'var(--success)', marginBottom: '8px', textAlign: 'center', fontSize: '1.6rem' }}>Registration Successful!</h2>
      <p style={{ color: 'var(--secondary-text)', textAlign: 'center', marginBottom: '24px', fontSize: '0.95rem' }}>
        Registration number : <strong style={{ color: 'var(--foreground)' }}>{registration.regNumber}</strong>
      </p>

      {/* TICKET WRAPPER */}
      <div style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))', width: '100%', maxWidth: '340px', marginBottom: '24px' }}>
        <div ref={ticketRef} id="export-ticket" style={{ 
          background: 'white', 
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Top Colored Part */}
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-alt))', 
            color: 'white', 
            padding: '30px 20px 16px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Corner Logos */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '65px', height: '65px', filter: 'brightness(0) invert(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <img src="/alum.png" alt="Alumni Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ position: 'absolute', top: '6px', right: '8px', width: '100px', height: '100px', filter: 'brightness(0) invert(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <img src="/disha.png" alt="Disha Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ fontSize: '0.75rem', letterSpacing: '0.05em', opacity: 0.9, marginBottom: '16px', textTransform: 'uppercase', fontWeight: '600', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '12px', marginTop: '20px' }}>
              ID: {registration.regNumber}
            </div>

            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.4)', padding: '2px' }}>
               <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            
            <div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '6px', lineHeight: 1.2 }}>
              {toTitleCase(registration.name)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '500', opacity: 0.9, marginBottom: '2px' }}>
              {registration.designation}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.2 }}>
              {registration.district} | Ph: {phone}
            </div>
          </div>

          {/* Dashed Divider Line with Hole Punches */}
          <div style={{ position: 'relative', width: '100%', height: '0px', borderTop: '2px dashed rgba(0,0,0,0.15)', zIndex: 10 }}>
            <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#fafafa' }}></div>
            <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#fafafa' }}></div>
          </div>

          {/* Bottom White Part */}
          <div style={{ background: 'white', padding: '36px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCodeSVG value={registration.regNumber} size={150} level="M" />
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ maxWidth: '210px', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>
        <button onClick={handleDownload} className="btn-primary" style={{ flex: 1, padding: '16px 0' }}>
          Download
        </button>
        <button onClick={handleShare} className="btn-secondary" style={{ flex: 1, padding: '16px 0' }}>
          Share
        </button>
      </div>
    </div>
  );
}
