"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus, Users, Loader2, X, AlertCircle, Briefcase, MapPin } from "lucide-react";

interface Jabatan {
  id: number;
  jabatan: string;
}

interface Karyawan {
  id: number;
  nik: string;
  nama: string;
  email: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  id_jabatan: number;
  status_aktif: boolean | number;
  jabatan?: Jabatan;
}

const EmployeeManagement = () => {
  // UI States
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data States
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  
  // Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    email: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    id_jabatan: "",
    status_aktif: "1" 
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // --- API FUNCTIONS ---

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
      
      const [resKaryawan, resJabatan] = await Promise.all([
        fetch("https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan", { headers }),
        fetch("https://payroll.politekniklp3i-tasikmalaya.ac.id/api/jabatan", { headers })
      ]);

      const dataK = await resKaryawan.json();
      const dataJ = await resJabatan.json();

      if (resKaryawan.ok) setKaryawanList(dataK.data || dataK);
      if (resJabatan.ok) setJabatanList(dataJ.data || dataJ);
    } catch (err) {
      setError("Gagal menyinkronkan data dengan server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // --- HANDLERS ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const url = editingId 
      ? `https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan/${editingId}`
      : "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan";

    const method = editingId ? "PATCH" : "POST";

    try {
      const payload = {
        nik: formData.nik,
        nama: formData.nama,
        email: formData.email,
        tempat_lahir: formData.tempat_lahir || "-",
        tanggal_lahir: formData.tanggal_lahir || "2000-01-01",
        alamat: formData.alamat || "-", // Alamat dikirim ke API
        id_jabatan: Number(formData.id_jabatan),
        status_aktif: formData.status_aktif === "1" ? 1 : 0
      };

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMsg = result.message || JSON.stringify(result.errors) || "Gagal memproses data.";
        throw new Error(errorMsg);
      }
      
      alert(editingId ? "Data berhasil diupdate!" : "Karyawan berhasil ditambahkan!");
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.message);
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Karyawan) => {
    setEditingId(item.id);
    setFormData({
      nik: item.nik || "",
      nama: item.nama || "",
      email: item.email || "",
      tempat_lahir: item.tempat_lahir || "",
      tanggal_lahir: item.tanggal_lahir || "",
      alamat: item.alamat || "", // Alamat dimasukkan ke Form
      id_jabatan: item.id_jabatan?.toString() || "",
      status_aktif: item.status_aktif ? "1" : "0"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus data karyawan ${name}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        }
      });

      if (!res.ok) throw new Error("Gagal menghapus data di server.");

      alert("Data terhapus.");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setError("");
    setFormData({
      nik: "", nama: "", email: "", tempat_lahir: "",
      tanggal_lahir: "", alamat: "", id_jabatan: "", status_aktif: "1"
    });
  };

  return (
    <div className="min-h-screen p-6 font-sans text-slate-800 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Karyawan</h1>
          <p className="text-slate-500">Kelola data personalia dan posisi kerja karyawan.</p>
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm animate-in slide-in-from-top duration-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div className="break-all">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- FORM COLUMN --- */}
          <div className="lg:col-span-4">
            <div className={`bg-white rounded-3xl shadow-sm border p-6 sticky top-6 transition-all ${editingId ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingId ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                    {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingId ? "Edit Data" : "Tambah Karyawan"}
                  </h2>
                </div>
                {editingId && (
                  <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">NIK</label>
                    <input 
                      type="text" 
                      value={formData.nik}
                      onChange={(e) => setFormData({...formData, nik: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                    required
                  />
                </div>

                {/* --- INPUT ALAMAT --- */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Alamat Domisili</label>
                  <textarea 
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none min-h-[80px] resize-none"
                    placeholder="Contoh: Jl. Merdeka No. 10..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tgl Lahir</label>
                        <input 
                            type="date" 
                            value={formData.tanggal_lahir}
                            onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Kota Lahir</label>
                        <input 
                            type="text" 
                            value={formData.tempat_lahir}
                            onChange={(e) => setFormData({...formData, tempat_lahir: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Jabatan</label>
                    <select 
                      value={formData.id_jabatan}
                      onChange={(e) => setFormData({...formData, id_jabatan: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      {jabatanList.map(j => (
                        <option key={j.id} value={j.id}>{j.jabatan}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Status</label>
                    <select 
                      value={formData.status_aktif}
                      onChange={(e) => setFormData({...formData, status_aktif: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                    >
                      <option value="1">Aktif</option>
                      <option value="0">Non-Aktif</option>
                    </select>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className={`w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg mt-4 flex items-center justify-center gap-2 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? "Update Data" : "Simpan Data")}
                </button>
              </form>
            </div>
          </div>

          {/* --- TABLE COLUMN --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Users size={20} className="text-indigo-500" />
                  Database Karyawan
                </h2>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-slate-500">
                  Total: {karyawanList.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-gray-50/30">
                      <th className="px-6 py-4">Karyawan & Alamat</th>
                      <th className="px-6 py-4">Jabatan</th>
                      <th className="px-6 py-4">Status Aktif</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {karyawanList.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50/80 transition-colors group ${editingId === item.id ? 'bg-indigo-50' : ''}`}
                        onMouseEnter={() => setHoveredRow(item.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-800">{item.nama}</div>
                          <div className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">NIK: {item.nik}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.email}</div>
                          {/* Menampilkan Alamat di tabel */}
                          <div className="flex items-start gap-1 mt-2 text-[10px] text-slate-400 italic max-w-[200px]">
                            <MapPin size={10} className="shrink-0 mt-0.5" />
                            <span className="truncate">{item.alamat || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                              <Briefcase size={12} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                              {item.jabatan?.jabatan || jabatanList.find(j => j.id === item.id_jabatan)?.jabatan || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status_aktif ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>
                            {item.status_aktif ? "Aktif" : "Non-Aktif"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className={`flex justify-end gap-1 transition-all ${hoveredRow === item.id || editingId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleDelete(item.id, item.nama)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {karyawanList.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm">
                          Belum ada data karyawan ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;