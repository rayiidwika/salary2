'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronDown, Pencil, Trash2, X, Users, Mail, Shield, MapPin } from 'lucide-react';

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  alamat: string;
}

const UserManagement = () => {
  // --- STATES ---
  const [users, setUsers] = useState<User[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'User / Karyawan',
    alamat: ''
  });

  // --- LOGIC CRUD ---

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simpan atau Update User
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Logic Update
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
      setEditingId(null);
    } else {
      // Logic Create
      const newUser: User = {
        id: Date.now(),
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        alamat: formData.alamat
      };
      setUsers([...users, newUser]);
    }

    // Reset Form
    setFormData({ nama: '', email: '', password: '', role: 'User / Karyawan', alamat: '' });
  };

  // Trigger Edit Mode
  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      nama: user.nama,
      email: user.email,
      password: '', // Password tidak ditampilkan demi keamanan
      role: user.role,
      alamat: user.alamat
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${name}?`)) {
      setUsers(users.filter(u => u.id !== id));
      if (editingId === id) resetEdit();
    }
  };

  const resetEdit = () => {
    setEditingId(null);
    setFormData({ nama: '', email: '', password: '', role: 'User / Karyawan', alamat: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-800">
      
      {/* --- HEADER UTAMA --- */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Management User</h1>
        <p className="text-slate-500 text-sm mt-1">Kontrol akses sistem dan izin pengguna secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        
        {/* --- KOLOM KIRI: FORM --- */}
        <div className="lg:col-span-4">
          <div className={`bg-white rounded-3xl p-6 shadow-sm border transition-all duration-300 ${editingId ? 'border-indigo-300 ring-4 ring-indigo-50' : 'border-gray-100'}`}>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingId ? 'bg-indigo-600 text-white' : 'bg-purple-50 text-purple-600'}`}>
                  {editingId ? <Pencil size={20} /> : <Plus size={20} strokeWidth={3} />}
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Update User' : 'Tambah User'}
                </h2>
              </div>
              {editingId && (
                <button onClick={resetEdit} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Nama</label>
                <input 
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  type="text" 
                  placeholder="Nama Lengkap" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  placeholder="email@example.com" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Alamat</label>
                <textarea 
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Alamat lengkap domisili" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all min-h-[80px] resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password" 
                  placeholder={editingId ? "Kosongkan jika tidak diubah" : "••••••••"} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  required={!editingId}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Role</label>
                <div className="relative">
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer text-slate-600"
                  >
                    <option>User / Karyawan</option>
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <button 
                type="submit"
                className={`w-full ${editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-900 hover:bg-blue-800'} text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg mt-6`}
              >
                {editingId ? 'Simpan Perubahan' : 'Simpan User'}
              </button>
            </form>
          </div>
        </div>

        {/* --- KOLOM KANAN: TABLE --- */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full min-h-[500px]">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-slate-400" />
                Data User Terdaftar
              </h2>
              <div className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                {users.length} Items Total
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="pb-4 pl-2 w-12 text-center">No</th>
                    <th className="pb-4">Profil User</th>
                    <th className="pb-4">Alamat</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4 pr-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={`hover:bg-gray-50 transition-colors border-t border-gray-50/50 group ${editingId === user.id ? 'bg-indigo-50/50' : ''}`}
                        onMouseEnter={() => setHoveredRow(user.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="py-5 text-center font-medium text-slate-400">{index + 1}</td>
                        <td className="py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{user.nama}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-5">
                          <span className="text-slate-500 flex items-start gap-1 max-w-[150px] truncate italic">
                            <MapPin size={12} className="mt-1 shrink-0" /> {user.alamat}
                          </span>
                        </td>
                        <td className="py-5">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            user.role.includes('Admin') 
                              ? 'bg-orange-50 text-orange-600 border-orange-100' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-5 pr-2 text-right">
                          <div className={`flex justify-end gap-2 transition-all duration-200 ${hoveredRow === user.id || editingId === user.id ? 'opacity-100' : 'opacity-0'}`}>
                            <button 
                              onClick={() => handleEdit(user)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                              title="Edit User"
                            >
                              <Pencil size={14} strokeWidth={2} />
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id, user.nama)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                              title="Hapus User"
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400 italic">
                        Belum ada data user. Silahkan tambah melalui form di samping.
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
  );
};

export default UserManagement;