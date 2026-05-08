import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Superadmin = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/superadmin/schools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchools(res.data.schools);
    } catch (err) {
      toast.error('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
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
      fetchSchools();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create school');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;
    try {
      await axios.delete(`${backendUrl}/api/superadmin/schools/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('School deleted successfully');
      fetchSchools();
    } catch (err) {
      toast.error('Failed to delete school');
    }
  };

  const handleImpersonate = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/superadmin/schools/${id}/impersonate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('token', res.data.token);
      toast.success('Entered school successfully');
      // Force reload to completely reset auth state
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error('Failed to enter school');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Superadmin Dashboard</h1>

        {/* Add School Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Whitelist New School</h2>
          <form onSubmit={handleCreateSchool} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              name="name" 
              placeholder="School Name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="email" 
              name="email" 
              placeholder="School Email" 
              value={formData.email} 
              onChange={handleChange} 
              required
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Temporary Password" 
              value={formData.password} 
              onChange={handleChange} 
              required
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              Create School
            </button>
          </form>
        </div>

        {/* Schools List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-700">Whitelisted Schools</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading schools...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="px-6 py-3">School Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">School Code</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-500">No schools whitelisted yet.</td></tr>
                ) : (
                  schools.map(school => (
                    <tr key={school._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{school.name}</td>
                      <td className="px-6 py-4 text-gray-600">{school.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-mono text-sm font-bold tracking-widest">
                          {school.schoolCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleImpersonate(school._id)} 
                          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        >
                          Enter
                        </button>
                        <button 
                          onClick={() => handleDelete(school._id)} 
                          className="text-red-500 hover:text-red-700 font-medium px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Superadmin;
