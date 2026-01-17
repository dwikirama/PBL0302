/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// === KONFIGURASI API (Sesuai PBL0302) ===
const API_URL = '/api/mobil';
const initialFormData = {
  merek: '',
  model: '',
  tahun: '',
  warna: ''
};

const teamMembers = ['Yurida Zani', 'Aulia Zamaira', 'Muhammad Dwiki Ramadani', 'Dimas Hammam Abdillah', 'Ali Sofyan'];

// ==========================================
// 1. KOMPONEN HALAMAN WELCOME
// ==========================================
const WelcomePage = () => {
  return (
    <div className="relative w-full min-h-screen font-sans text-white overflow-hidden">
      {/* Background Image dari LandingPage.jsx */}
      <img 
        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070" 
        alt="Mountain background"
        className="absolute top-0 left-0 object-cover w-full h-full"
      />
      
      {/* Overlay Gelap */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 opacity-80"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen p-8 text-center">
        {/* Judul Grup */}
        <h1 className="text-6xl font-bold md:text-8xl font-playfair">
          Tadika Mesra
        </h1>
        
        {/* H2: Nama Folder */}
        <h2 className="text-2xl md:text-4xl font-light text-orange-400 mb-6 tracking-[0.3em] uppercase">
          PBL0302 - Monolith
        </h2>
        
        {/* P: Deskripsi Singkat Satu Baris */}
        <p className="max-w-3xl text-lg md:text-xl text-white/80 leading-relaxed mb-10">
          Sistem manajemen data inventaris mobil menggunakan teknologi React.js dan Node.js.
        </p>
        
        {/* Tombol Navigasi Project Utama */}
        <div className="flex flex-col gap-4 mt-10 sm:flex-row">
          <Link 
            to="/pbl0302" 
            className="px-12 py-4 font-bold text-center text-white transition-all duration-300 transform bg-orange-800 rounded-full hover:scale-105 shadow-2xl uppercase tracking-widest hover:bg-orange-700"
          >
            Buka Dashboard Project
          </Link>
        </div>
        
        {/* Team Members Section */}
        <div className="mt-16">
          <h3 className="tracking-widest uppercase text-orange-200/60 text-xs font-bold mb-4">Developed By Team</h3>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {teamMembers.map((member, index) => (
              <span key={index} className="text-sm font-medium text-white/50">{member}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. KOMPONEN DASHBOARD (TAMPILAN VERSI AWAL)
// ==========================================
const MobilCrudPage = () => {
  const [mobilList, setMobilList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null); 

  const fetchMobil = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { q: searchTerm }
      });
      setMobilList(response.data.data);
    } catch (error) {
      console.error("Error fetching data mobil:", error);
    }
  };

  useEffect(() => {
    fetchMobil();
  }, [searchTerm]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.merek || !formData.model) {
      alert("Merek dan Model wajib diisi!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData(initialFormData);
      setEditingId(null);
      fetchMobil();
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
    }
  };

  const handleEditClick = (mobil) => {
    setEditingId(mobil.id);
    setFormData({
      merek: mobil.merek,
      model: mobil.model,
      tahun: mobil.tahun,
      warna: mobil.warna
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMobil(); 
      } catch (error) {
        console.error("Error saat menghapus data:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-blue-600 hover:underline">← Kembali ke Welcome</Link>
          <h1 className="text-4xl font-bold text-center text-gray-800">
            CRUDS Data Mobil
          </h1>
          <div className="w-24"></div> 
        </div>
        <p className="text-center text-gray-500 italic mb-6">
          React.js + Node.js + SQLite + Tailwind
        </p>

        {/* FORM (VERSI AWAL) */}
        <form onSubmit={handleFormSubmit} className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            {editingId ? 'Edit Data Mobil' : 'Tambah Data Mobil Baru'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="merek" placeholder="Merek" value={formData.merek} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="number" name="tahun" placeholder="Tahun" value={formData.tahun} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="warna" placeholder="Warna" value={formData.warna} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              {editingId ? 'Update Data' : 'Simpan Data'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData(initialFormData);}} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 shadow-sm">
                Batal
              </button>
            )}
          </div>
        </form>

        {/* SEARCH BAR (VERSI AWAL) */}
        <div className="my-4">
          <input 
            type="text"
            placeholder="Cari berdasarkan Merek atau Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LIST CARDS (VERSI AWAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mobilList.length > 0 ? (
            mobilList.map((mobil) => (
              <div key={mobil.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-blue-700">{mobil.merek} {mobil.model}</h3>
                <p className="text-gray-600">Tahun: {mobil.tahun}</p>
                <p className="text-gray-600">Warna: {mobil.warna}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleEditClick(mobil)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">Edit</button>
                  <button onClick={() => handleDeleteClick(mobil.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Hapus</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              {searchTerm ? 'Data tidak ditemukan.' : 'Belum ada data mobil.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN ROUTER
// ==========================================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/pbl0302" element={<MobilCrudPage />} />
      </Routes>
    </Router>
  );
}