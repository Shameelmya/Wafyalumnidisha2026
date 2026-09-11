"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import * as XLSX from 'xlsx';
import { districts } from '@/lib/districts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function toTitleCase(str: string) {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showCaution, setShowCaution] = useState(false);
  const [sortBy, setSortBy] = useState('timeDesc');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterAttendance, setFilterAttendance] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', name: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, data: null as any });
  const [editLoading, setEditLoading] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError("Invalid admin credentials");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const configRef = doc(db, 'config', 'admin');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        setIsRegOpen(configSnap.data().registration);
      }

      const querySnapshot = await getDocs(collection(db, 'registrations'));
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // Removed static sort, sorting is handled dynamically during render
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleRegistration = async () => {
    try {
      const newState = !isRegOpen;
      await setDoc(doc(db, 'config', 'admin'), { registration: newState }, { merge: true });
      setIsRegOpen(newState);
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = () => {
    // Map to strictly ordered objects with clean header names
    const formattedData = registrations.map(r => ({
      "Reg Number": r.regNumber,
      "Name": toTitleCase(r.name),
      "Phone Number": r.phone,
      "WhatsApp": r.whatsapp || r.phone,
      "District": r.district,
      "Designation": r.designation,
      "Status": r.status || "Pending",
      "Registration Date": r.timestamp ? new Date(r.timestamp).toLocaleString() : ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "Wafy_Leaders_Conclave_Registrations.xlsx");
  };

  const markAttendance = async (id: string) => {
    try {
      await updateDoc(doc(db, 'registrations', id), { status: 'Attended' });
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Attended' } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePointerDown = (id: string, currentStatus: string) => {
    if (currentStatus !== 'Attended') return;
    pressTimer.current = setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'registrations', id), { status: 'Pending' });
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Pending' } : r));
      } catch (err) {
        console.error(err);
      }
    }, 3000); 
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'registrations', deleteModal.id));
      setRegistrations(prev => prev.filter(r => r.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: '', name: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to delete registration.");
    }
    setDeleteLoading(false);
  };

  const saveEdit = async (e: any) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const { id, ...updateData } = editModal.data;
      await updateDoc(doc(db, 'registrations', id), updateData);
      setRegistrations(prev => prev.map(r => r.id === id ? editModal.data : r));
      setEditModal({ isOpen: false, data: null });
    } catch (err) {
      console.error(err);
      alert("Failed to update registration.");
    }
    setEditLoading(false);
  };

  if (authLoading) {
    return <div className="container animate-fade-in" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container animate-fade-in" style={{ paddingTop: '100px', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Admin Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {loginError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{loginError}</p>}
          <button type="submit" disabled={loginLoading} className="btn-primary" style={{ marginTop: '8px', opacity: loginLoading ? 0.7 : 1 }}>
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  const attendedCount = registrations.filter(r => r.status === 'Attended').length;

  const uniqueDistricts = Array.from(new Set(registrations.map(r => r.district))).filter(Boolean);
  const uniqueDesignations = Array.from(new Set(registrations.map(r => r.designation))).filter(Boolean);
  const unregisteredDistricts = districts.filter(s => !uniqueDistricts.includes(s));

  const districtCounts = registrations.reduce((acc: any, r: any) => {
    if (r.district) {
      acc[r.district] = (acc[r.district] || 0) + 1;
    }
    return acc;
  }, {});

  const registeredDistrictsWithCounts = Object.keys(districtCounts)
    .map(district => ({ district, count: districtCounts[district] }))
    .sort((a, b) => b.count - a.count);

  const designationCounts = registrations.reduce((acc: any, r: any) => {
    if (r.designation) {
      acc[r.designation] = (acc[r.designation] || 0) + 1;
    }
    return acc;
  }, {});

  const designationStats = Object.keys(designationCounts)
    .map(designation => ({ designation, count: designationCounts[designation] }))
    .sort((a, b) => b.count - a.count);

  const filteredRegistrations = registrations.filter(r => {
    if (filterDistrict && r.district !== filterDistrict) return false;
    if (filterDesignation && r.designation !== filterDesignation) return false;
    if (filterAttendance) {
      const status = r.status || 'Pending';
      if (status !== filterAttendance) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!r.name?.toLowerCase().includes(term) &&
          !r.district?.toLowerCase().includes(term) &&
          !r.regNumber?.toLowerCase().includes(term) &&
          !r.phone?.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const getTime = (r: any) => {
    if (r.createdAt && r.createdAt.seconds) return r.createdAt.seconds;
    if (r.timestamp) return r.timestamp / 1000;
    return 0;
  };

  const sortedAndFiltered = [...filteredRegistrations].sort((a, b) => {
    if (sortBy === 'timeDesc') return getTime(b) - getTime(a);
    if (sortBy === 'timeAsc') return getTime(a) - getTime(b);
    if (sortBy === 'nameAsc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'nameDesc') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'districtAsc') return (a.district || '').localeCompare(b.district || '');
    if (sortBy === 'districtDesc') return (b.district || '').localeCompare(a.district || '');
    return 0;
  });

  const exportDistrictStatsToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("District Registration Statistics", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Total Registrations: ${registrations.length}`, 14, 32);
    doc.text(`Total Attended: ${attendedCount}`, 14, 40);

    // Registered Districts Table
    doc.setFontSize(14);
    doc.text(`Registered Districts (${registeredDistrictsWithCounts.length})`, 14, 52);
    
    const registeredData = registeredDistrictsWithCounts.map((s, index) => [
      index + 1,
      s.district,
      s.count
    ]);

    autoTable(doc, {
      startY: 56,
      head: [['#', 'District Name', 'Registrations']],
      body: registeredData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });

    let finalY = (doc as any).lastAutoTable.finalY || 56;
    
    // Unregistered Districts Table
    doc.setFontSize(14);
    doc.text(`Unregistered Districts (${unregisteredDistricts.length})`, 14, finalY + 14);
    
    const unregisteredData = unregisteredDistricts.map((s, index) => [
      index + 1,
      s
    ]);

    autoTable(doc, {
      startY: finalY + 18,
      head: [['#', 'District Name']],
      body: unregisteredData,
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] }
    });

    doc.save("District_Statistics_Report.pdf");
  };

  const exportDistrictStatsToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Registered Districts Sheet
    const registeredData = registeredDistrictsWithCounts.map((s, index) => ({
      "Sl No": index + 1,
      "District Name": s.district,
      "Registrations": s.count
    }));
    const registeredSheet = XLSX.utils.json_to_sheet(registeredData);
    XLSX.utils.book_append_sheet(workbook, registeredSheet, "Registered Districts");

    // Unregistered Districts Sheet
    const unregisteredData = unregisteredDistricts.map((s, index) => ({
      "Sl No": index + 1,
      "District Name": s
    }));
    const unregisteredSheet = XLSX.utils.json_to_sheet(unregisteredData);
    XLSX.utils.book_append_sheet(workbook, unregisteredSheet, "Unregistered Districts");

    XLSX.writeFile(workbook, "District_Statistics_Report.xlsx");
  };

  return (
    <div className="admin-container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px', designation: 'relative' }}>
      
      {/* HEADER WITH ICON BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#0f172a' }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/scanner" title="Open Scanner" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg>
          </Link>
          <button onClick={fetchData} title="Refresh Data" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </button>
          <button onClick={handleLogout} title="Logout" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>

      {/* STATS IN ONE LINE */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div className="glass" style={{ flex: 1, padding: '20px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '4px' }}>Total Registered</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{registrations.length}</div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '20px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '4px' }}>Total Attended</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>{attendedCount}</div>
        </div>
      </div>

      <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '32px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', marginBottom: '12px' }}>Registration Status</div>
        <button 
          onClick={toggleRegistration} 
          style={{ 
            width: '100%', 
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            background: isRegOpen ? 'var(--danger)' : 'var(--success)', 
            color: 'white' 
          }}
        >
          {isRegOpen ? 'Close Registration' : 'Open Registration'}
        </button>
      </div>

      {/* FILTER & EXPORT ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Registrations</h2>
          <button 
            onClick={() => { setShowCaution(false); setShowSort(false); setShowFilter(!showFilter); }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: showFilter ? 'var(--primary)' : 'white', 
              color: showFilter ? 'white' : 'var(--primary)', 
              border: '1px solid #e2e8f0', cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            title="Filter Options"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </button>
          <button 
            onClick={() => { setShowCaution(false); setShowFilter(false); setShowSort(!showSort); }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: showSort ? 'var(--primary)' : 'white', 
              color: showSort ? 'white' : 'var(--primary)', 
              border: '1px solid #e2e8f0', cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            title="Sort Options"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </button>
          <button 
            onClick={() => { setShowFilter(false); setShowSort(false); setShowCaution(!showCaution); }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: showCaution ? 'var(--danger)' : 'white', 
              color: showCaution ? 'white' : 'var(--danger)', 
              border: '1px solid #e2e8f0', cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            title="Detailed Statistics"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </button>
        </div>
        <button onClick={exportToExcel} style={{ background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
          Export to Excel
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilter && (
        <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>Filter by District</label>
            <select className="input-field" value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} style={{ padding: '12px' }}>
              <option value="">All Districts</option>
              {uniqueDistricts.map((s: any) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>Filter by Designation</label>
            <select className="input-field" value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)} style={{ padding: '12px' }}>
              <option value="">All Designations</option>
              {uniqueDesignations.map((p: any) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>Filter by Attendance</label>
            <select className="input-field" value={filterAttendance} onChange={e => setFilterAttendance(e.target.value)} style={{ padding: '12px' }}>
              <option value="">All Statuses</option>
              <option value="Attended">Attended</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          {(filterDistrict || filterDesignation || filterAttendance) && (
            <button onClick={() => { setFilterDistrict(''); setFilterDesignation(''); setFilterAttendance(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'right', fontWeight: '600', marginTop: '4px' }}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* SORT PANEL */}
      {showSort && (
        <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>Sort By</label>
            <select className="input-field" value={sortBy} onChange={e => { setSortBy(e.target.value); setShowSort(false); }} style={{ padding: '12px' }}>
              <option value="timeDesc">Latest First (Time)</option>
              <option value="timeAsc">Oldest First (Time)</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="districtAsc">District (A-Z)</option>
              <option value="districtDesc">District (Z-A)</option>
            </select>
          </div>
        </div>
      )}

      {/* CAUTION / SCHOOL STATS PANEL */}
      {showCaution && (
        <div className="glass animate-fade-in" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Detailed Statistics
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={exportDistrictStatsToExcel} 
                style={{ 
                  background: 'white', 
                  color: '#059669', 
                  border: '1px solid #059669', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Export Excel
              </button>
              <button 
                onClick={exportDistrictStatsToPDF} 
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export PDF
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Registered Districts */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--success)', marginBottom: '8px' }}>
                Registered Districts ({registeredDistrictsWithCounts.length})
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                {registeredDistrictsWithCounts.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {registeredDistrictsWithCounts.map(s => (
                      <li key={s.district} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#334155', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                        <span>{s.district}</span>
                        <span style={{ fontWeight: '600', color: 'var(--primary)', background: 'rgba(0,198,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{s.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', textAlign: 'center' }}>No registrations yet.</div>
                )}
              </div>
            </div>

            {/* Unregistered Districts */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--danger)', marginBottom: '8px' }}>
                Unregistered Districts ({unregisteredDistricts.length})
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                {unregisteredDistricts.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {unregisteredDistricts.map(s => (
                      <li key={s} style={{ fontSize: '0.9rem', color: '#334155', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: 'var(--success)', textAlign: 'center' }}>All districts have registered!</div>
                )}
              </div>
            </div>
            </div>

            {/* Designation Stats */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-alt)', marginBottom: '8px' }}>
                Designation Breakdown ({designationStats.length})
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                {designationStats.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {designationStats.map(d => (
                      <li key={d.designation} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#334155', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                        <span>{d.designation}</span>
                        <span style={{ fontWeight: '600', color: 'var(--primary)', background: 'rgba(0,198,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{d.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', textAlign: 'center' }}>No registrations yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SEARCH BAR (NO PLACEHOLDER TEXT) */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder=""
          className="input-field"
          style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
        />
        <div style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', marginTop: '8px' }}>Search by Name, Phone, District, or Reg No</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading data...</div>
      ) : (
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--secondary-text)' }}>Reg No</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--secondary-text)' }}>Name</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--secondary-text)' }}>Phone</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--secondary-text)' }}>District</th>
                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--secondary-text)' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--secondary-text)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFiltered.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i === sortedAndFiltered.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px', fontWeight: '600' }}>{r.regNumber}</td>
                  <td style={{ padding: '16px' }}>
                    {toTitleCase(r.name)}<br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>{r.designation}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <a href={`tel:${r.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                      {r.phone}
                    </a>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem' }}>{r.district}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600',
                      background: (r.status || 'Pending') === 'Attended' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                      color: (r.status || 'Pending') === 'Attended' ? 'var(--success)' : '#ff9500'
                    }}>
                      {r.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                      {(r.status || 'Pending') === 'Pending' ? (
                        <button 
                          onClick={() => markAttendance(r.id)} 
                          style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(52, 199, 89, 0.1)', color: 'var(--success)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Mark Attended"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                      ) : (
                        <button 
                          onPointerDown={() => handlePointerDown(r.id, r.status)}
                          onPointerUp={handlePointerUp}
                          onPointerLeave={handlePointerUp}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Attended (Long press 3s to revert)"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setEditModal({ isOpen: true, data: { ...r } })} 
                        style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,198,255,0.1)', color: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Edit Entry"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: r.id, name: r.name })} 
                        style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,59,48,0.1)', color: 'var(--danger)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete Entry"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedAndFiltered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--secondary-text)' }}>No registrations found.</div>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div style={{ designation: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass animate-fade-in" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '1.4rem' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--secondary-text)', marginBottom: '32px', lineHeight: '1.5' }}>
              Are you completely sure you want to delete the registration for <strong>{deleteModal.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" disabled={deleteLoading} onClick={() => setDeleteModal({ isOpen: false, id: '', name: '' })} className="btn-secondary" style={{ flex: 1, padding: '14px', opacity: deleteLoading ? 0.7 : 1 }}>Cancel</button>
              <button type="button" disabled={deleteLoading} onClick={confirmDelete} className="btn-primary" style={{ flex: 1, background: 'var(--danger)', padding: '14px', opacity: deleteLoading ? 0.7 : 1 }}>
                {deleteLoading ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal.isOpen && editModal.data && (
        <div style={{ designation: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass animate-fade-in" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.4rem', color: 'var(--primary)' }}>Edit Registration</h3>
            <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '500' }}>Name</label>
                <input type="text" className="input-field" value={editModal.data.name} onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '500' }}>Phone</label>
                <input type="tel" className="input-field" value={editModal.data.phone} onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, phone: e.target.value.replace(/[^0-9]/g, '') } })} required pattern="[0-9]*" inputMode="numeric" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '500' }}>WhatsApp</label>
                <input type="tel" className="input-field" value={editModal.data.whatsapp} onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, whatsapp: e.target.value.replace(/[^0-9]/g, '') } })} required pattern="[0-9]*" inputMode="numeric" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '500' }}>District</label>
                <input type="text" className="input-field" value={editModal.data.district} onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, district: e.target.value } })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '500' }}>Designation</label>
                <input type="text" className="input-field" value={editModal.data.designation} onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, designation: e.target.value } })} required />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" disabled={editLoading} onClick={() => setEditModal({ isOpen: false, data: null })} className="btn-secondary" style={{ flex: 1, padding: '14px', opacity: editLoading ? 0.7 : 1 }}>Cancel</button>
                <button type="submit" disabled={editLoading} className="btn-primary" style={{ flex: 1, padding: '14px', opacity: editLoading ? 0.7 : 1 }}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
