import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Superadmin = () => {
  const [schools, setSchools] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [schoolsRes, statsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/superadmin/schools`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${backendUrl}/api/superadmin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSchools(schoolsRes.data.schools);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/superadmin/schools`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      setFormData({ name: '', email: '', password: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create school');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school permanently?")) return;
    try {
      await axios.delete(`${backendUrl}/api/superadmin/schools/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('School deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete school');
    }
  };

  const handleImpersonate = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/superadmin/schools/${id}/impersonate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Store original superadmin token to allow seamless return
      localStorage.setItem('superadmin_token', token);
      
      // Set new tokens
      localStorage.setItem('token', res.data.accessToken || res.data.token);
      if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);

      toast.success('Entering school dashboard...');
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error('Failed to enter school');
    }
  };

  const toggleConfig = async (id, field, currentValue) => {
    try {
      await axios.patch(`${backendUrl}/api/superadmin/schools/${id}/config`, {
        [field]: !currentValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Updated successfully`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update configuration');
    }
  };

  const updateBilling = async (id, status) => {
    try {
      await axios.patch(`${backendUrl}/api/superadmin/schools/${id}/config`, {
        billingStatus: status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Billing status updated`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update billing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <ToastContainer theme="dark" />
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              God's Eye Overview
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Enterprise SaaS Management & Telemetry</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-400">{stats?.systemHealth}</span>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition duration-300">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Tenants</h3>
            <p className="text-4xl font-bold mt-2 text-white">{stats?.totalSchools || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition duration-300">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Users</h3>
            <div className="flex gap-4 mt-2">
              <div>
                <p className="text-2xl font-bold text-blue-400">{stats?.totalStudents || 0}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{stats?.totalTeachers || 0}</p>
                <p className="text-xs text-gray-500">Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition duration-300">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Twilio API Cost</h3>
            <p className="text-4xl font-bold mt-2 text-red-400">{stats?.apiCosts?.twilio || '$0.00'}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition duration-300">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">AuthKey API Cost</h3>
            <p className="text-4xl font-bold mt-2 text-yellow-400">{stats?.apiCosts?.authkey || '$0.00'}</p>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Onboard */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl sticky top-8">
              <h2 className="text-lg font-semibold mb-6 text-white border-b border-white/10 pb-4">Onboard New Tenant</h2>
              <form onSubmit={handleCreateSchool} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">School Name</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full mt-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Admin Email</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full mt-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Initial Password</label>
                  <input 
                    type="password" name="password" value={formData.password} onChange={handleChange} required
                    className="w-full mt-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
                  />
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">
                  Provision Tenant Environment
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Tenant Management */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Active Tenants Directory</h2>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                  {schools.length} Deployments
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                      <th className="px-6 py-4 font-semibold">Tenant ID / Name</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                      <th className="px-6 py-4 font-semibold text-center">Billing</th>
                      <th className="px-6 py-4 font-semibold text-center">Modules</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {schools.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-12 text-gray-500">No active tenants.</td></tr>
                    ) : (
                      schools.map(school => (
                        <tr key={school._id} className="hover:bg-white/[0.02] transition">
                          {/* Name & ID */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-base">{school.name}</span>
                              <span className="text-xs text-gray-500 font-mono mt-1">{school.email} • Code: {school.schoolCode}</span>
                            </div>
                          </td>

                          {/* Status Toggle */}
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => toggleConfig(school._id, 'isActive', school.isActive)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${school.isActive !== false ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${school.isActive !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase">{school.isActive !== false ? 'Active' : 'Suspended'}</p>
                          </td>

                          {/* Billing Dropdown */}
                          <td className="px-6 py-4 text-center">
                            <select 
                              value={school.billingStatus || 'trial'} 
                              onChange={(e) => updateBilling(school._id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none appearance-none cursor-pointer border
                                ${school.billingStatus === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                  school.billingStatus === 'unpaid' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}
                            >
                              <option value="trial" className="bg-gray-900 text-white">Trial</option>
                              <option value="paid" className="bg-gray-900 text-white">Paid</option>
                              <option value="unpaid" className="bg-gray-900 text-white">Unpaid</option>
                            </select>
                          </td>

                          {/* Modules Toggles */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-4">
                              <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleConfig(school._id, 'allowWhatsApp', school.allowWhatsApp)}>
                                <span className={`text-xl ${school.allowWhatsApp !== false ? 'text-green-400' : 'text-gray-600 grayscale opacity-50'}`}>💬</span>
                                <span className="text-[9px] text-gray-500 mt-1">WA</span>
                              </div>
                              <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleConfig(school._id, 'allowSMS', school.allowSMS)}>
                                <span className={`text-xl ${school.allowSMS === true ? 'text-blue-400' : 'text-gray-600 grayscale opacity-50'}`}>✉️</span>
                                <span className="text-[9px] text-gray-500 mt-1">SMS</span>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleImpersonate(school._id)} 
                                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                                title="Login As Superadmin"
                              >
                                Login As
                              </button>
                              <button 
                                onClick={() => handleDelete(school._id)} 
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition"
                                title="Delete Tenant"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
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

export default Superadmin;
