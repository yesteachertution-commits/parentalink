import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', assignedClasses: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/teachers`, { headers: getAuthHeader() });
      setTeachers(res.data.teachers);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch teachers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleClassToggle = (cls) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(cls)
        ? prev.assignedClasses.filter(c => c !== cls)
        : [...prev.assignedClasses, cls]
    }));
  };
  const handleSelectAllClasses = () => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.length === gradeClasses.length ? [] : gradeClasses
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${backendUrl}/api/teachers`, formData, { headers: getAuthHeader() });
      setSuccess('Teacher added successfully!');
      setFormData({ name: '', email: '', password: '' });
      setShowAddModal(false);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add teacher.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`${backendUrl}/api/teachers/${id}`, { headers: getAuthHeader() });
        fetchTeachers();
      } catch (err) {
        alert('Failed to delete teacher');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading teachers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Teacher Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Add New Teacher
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Email (Login ID)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Classes</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No teachers added yet.</td></tr>
            ) : (
              teachers.map(teacher => (
                <tr key={teacher._id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{teacher.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{teacher.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Teacher</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.assignedClasses && teacher.assignedClasses.length > 0 
                      ? (teacher.assignedClasses.length === 12 ? 'All Classes' : teacher.assignedClasses.join(', '))
                      : 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(teacher._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Teacher</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-800">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Assigned Classes</label>
                    <button type="button" onClick={handleSelectAllClasses} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      {formData.assignedClasses.length === gradeClasses.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                    {gradeClasses.map(cls => (
                      <label key={cls} className="flex items-center space-x-2 text-sm bg-white p-1 rounded shadow-sm border border-gray-100 cursor-pointer hover:bg-blue-50 transition">
                        <input
                          type="checkbox"
                          checked={formData.assignedClasses.includes(cls)}
                          onChange={() => handleClassToggle(cls)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">Create Teacher</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDirectory;
