"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDocs, setDoc, serverTimestamp, runTransaction, collection } from 'firebase/firestore';

function normalizePhone(phone: string) {
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.length > 10) {
    if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.substring(2);
    } else if (digits.startsWith('091') && digits.length === 13) {
      digits = digits.substring(3);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.substring(1);
    }
  }
  return digits;
}

function toTitleCase(str: string) {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const designationsList = [
  "State Executive", "State Working Committee Member", "District President",
  "District Secretary", "District Working Secretary", "District ട്രഷറർ",
  "SEM Chairman", "SEM Convenor", "NEM Chairman", "NEM Convenor",
  "Waa Media Chairman", "Waa Media Convenor", "Debate Council Chairman",
  "Debate Council Convenor", "Way Books Chairman", "Way Books Convenor",
  "Higher Education Chairman", "Higher Education Convenor",
  "SEM District Co-ordinator", "NEM District Co-ordinator",
  "Way Books District Co-ordinator", "Special Delegate", "Other"
];

const districtsList = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
  "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
  "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad", "Other"
];

function SearchableDropdown({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input-field"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: value ? 'var(--foreground)' : '#94a3b8' }}
      >
        {value || placeholder}
        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>▼</span>
      </div>
      
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, overflow: 'hidden' }}>
          <div style={{ padding: '8px' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filtered.length > 0 ? filtered.map((opt, idx) => (
              <div 
                key={idx} 
                onClick={() => { onChange(opt); setIsOpen(false); setSearch(''); }}
                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #f1f5f9', background: value === opt ? '#f8fafc' : 'white', fontWeight: value === opt ? '600' : '400', color: value === opt ? 'var(--primary)' : 'var(--foreground)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = value === opt ? '#f8fafc' : 'white')}
              >
                {opt}
              </div>
            )) : (
              <div style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    district: '',
    designation: ''
  });
  const [photoBase64, setPhotoBase64] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [customDesignation, setCustomDesignation] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsPhone(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, whatsapp: prev.phone }));
    } else {
      setFormData((prev) => ({ ...prev, whatsapp: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFileName('');
      setPhotoBase64('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.designation) return setError('Please select a designation.');
    if (formData.designation === 'Other' && !customDesignation) return setError('Please enter your designation.');
    if (!formData.district) return setError('Please select a district.');
    if (formData.district === 'Other' && !customDistrict) return setError('Please enter your district.');

    setLoading(true);
    setError('');

    try {
      const normPhone = normalizePhone(formData.phone);
      if (normPhone.length < 10) {
        setError('Please enter a valid 10-digit phone number.');
        setLoading(false);
        return;
      }

      const qSnap = await getDocs(collection(db, 'registrations'));
      let isDuplicate = false;
      qSnap.forEach(docSnap => {
        if (normalizePhone(docSnap.id) === normPhone || normalizePhone(docSnap.data().phone || '') === normPhone) {
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setError('Phone number is already registered.');
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'registrations', normPhone);
      const counterRef = doc(db, 'config', 'counter');
      
      const regNumber = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let newCount = 1;
        if (counterDoc.exists()) {
          newCount = (counterDoc.data().value || 0) + 1;
        }
        transaction.set(counterRef, { value: newCount }, { merge: true });
        return "WDC26" + String(newCount).padStart(3, '0');
      });

      const titleCaseName = toTitleCase(formData.name);
      
      const finalDesignation = formData.designation === 'Other' ? customDesignation : formData.designation;
      const finalDistrict = formData.district === 'Other' ? customDistrict : formData.district;

      await setDoc(docRef, {
        ...formData,
        name: titleCaseName,
        designation: finalDesignation,
        district: finalDistrict,
        phone: normPhone,
        whatsapp: sameAsPhone ? normPhone : normalizePhone(formData.whatsapp),
        regNumber,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      if (photoBase64) {
        sessionStorage.setItem(`photo_${normPhone}`, photoBase64);
      }

      router.push(`/ticket/${normPhone}`);

    } catch (err: any) {
      console.error(err);
      setError('An error occurred while submitting. Check Firebase.');
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <button onClick={() => router.back()} style={{ background: 'transparent', color: 'var(--primary-alt)', fontWeight: '600', marginBottom: '24px', fontSize: '1rem', padding: '0', border: 'none', cursor: 'pointer' }}>
        &larr; Back
      </button>
      
      <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>Conclave Registration</h1>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '16px', borderRadius: '16px', marginBottom: '24px', fontWeight: '500', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        
        <div className="input-wrapper">
          <label className="input-label">Full Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Enter your full name" />
        </div>

        <div className="input-wrapper" style={{ position: 'relative' }}>
          <label className="input-label">Designation</label>
          <SearchableDropdown 
            options={designationsList} 
            value={formData.designation} 
            onChange={(val) => setFormData({ ...formData, designation: val })} 
            placeholder="Select your designation" 
          />
        </div>

        {formData.designation === 'Other' && (
          <div className="input-wrapper">
            <label className="input-label">Enter Designation</label>
            <input required type="text" value={customDesignation} onChange={(e) => setCustomDesignation(e.target.value)} className="input-field" placeholder="E.g. Vice President" />
          </div>
        )}
        
        <div className="input-wrapper" style={{ position: 'relative' }}>
          <label className="input-label">District</label>
          <SearchableDropdown 
            options={districtsList} 
            value={formData.district} 
            onChange={(val) => setFormData({ ...formData, district: val })} 
            placeholder="Select your district" 
          />
        </div>

        {formData.district === 'Other' && (
          <div className="input-wrapper">
            <label className="input-label">Enter District</label>
            <input required type="text" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} className="input-field" placeholder="Your District Name" />
          </div>
        )}
        
        <div className="input-wrapper">
          <label className="input-label">Phone Number</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            handleChange(e);
            if(sameAsPhone) setFormData(prev => ({...prev, whatsapp: e.target.value}));
          }} className="input-field" pattern="[0-9]*" inputMode="numeric" placeholder="10-digit mobile number" />
        </div>

        <div className="input-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginLeft: '12px', marginRight: '12px' }}>
            <label className="input-label" style={{ margin: 0 }}>WhatsApp Number</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
              <input type="checkbox" checked={sameAsPhone} onChange={handleCheckbox} style={{ width: '16px', height: '16px', accentColor: 'var(--primary-alt)' }} />
              Same as phone
            </label>
          </div>
          {!sameAsPhone && (
            <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
              handleChange(e);
            }} className="input-field" pattern="[0-9]*" inputMode="numeric" placeholder="WhatsApp mobile number" />
          )}
        </div>

        <div className="input-wrapper">
          <label className="input-label">Photo for Entry Pass (Optional)</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            <label htmlFor="photo-upload" className="input-field" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <div style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', marginRight: '16px', border: '1px solid #cbd5e1' }}>
                Choose File
              </div>
              <span style={{ color: photoFileName ? 'var(--foreground)' : '#94a3b8', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {photoFileName || 'No file chosen'}
              </span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '24px' }}>
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
