import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddStudentModal from '../models/AddStudentModal';
import BulkImportModal from '../models/BulkImportModal';
import { useStudents, useStudentMutations } from '../hooks/useStudents';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2, FiPlus, FiUsers, FiBell } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StudentDirectory = () => {
  const { token, user } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  
  const { data, isLoading, isError, refetch } = useStudents({ 
    page, 
    limit: 10, 
    classes: selectedClass 
  });

  const { updateMutation, deleteMutation, bulkDeleteMutation } = useStudentMutations();
  const [selectedStudents, setSelectedStudents] = useState([]);

  const students = data?.students || [];
  const totalPages = data?.totalPages || 1;
  const totalStudents = data?.totalStudents || 0;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    rollNo: '',
    classes: ''
  });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Fee Ledger State
  const [feeMonth, setFeeMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reminding, setReminding] = useState(false);

  const handleFeeChange = async (id, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/students/${id}/fee`, { month: feeMonth, status }, { headers: { Authorization: `Bearer ${token}` } });
      refetch();
      showToast('Fee status updated');
    } catch (err) { showToast('Failed to update fee', 'error'); }
  };

  const handleRemindAll = async () => {
    if (!window.confirm(`Send push/SMS reminders to all parents with pending fees for ${feeMonth}?`)) return;
    setReminding(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/fee-reminders`, { month: feeMonth }, { headers: { Authorization: `Bearer ${token}` } });
      showToast(res.data.message);
    } catch (err) { showToast('Failed to send reminders', 'error'); }
    finally { setReminding(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleAddStudent = async () => {
    refetch();
    setShowAddModal(false);
    showToast('Student added successfully!');
  };

  const handleImportSuccess = () => {
    refetch();
    showToast('Students imported successfully!');
  };

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setPage(1);
  };

  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const studentClasses = Array.from(new Set(students.map(s => s.classes)));
  const classes = ['All Classes', ...Array.from(new Set([...gradeClasses, ...studentClasses]))];

  const filteredStudents = students;

  const handleEditClick = (student) => {
    const sid = student._id || student.id;
    setEditingStudent(sid);
    setEditFormData({
      name: student.name,
      fatherName: student.fatherName,
      mobile: student.mobile,
      rollNo: student.rollNo || '',
      classes: student.classes
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await updateMutation.mutateAsync({ id, data: editFormData });
      setEditingStudent(null);
      showToast('Student updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update student', 'error');
    }
  };

  const confirmDelete = (id) => setShowDeleteConfirm(id);
  const cancelDelete = () => setShowDeleteConfirm(null);

  const deleteStudent = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      setShowDeleteConfirm(null);
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
      showToast('Student deleted successfully!');
    } catch (err) {
      console.error("Error deleting student:", err);
      showToast('Failed to delete student', 'error');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(s => s._id || s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) {
      try {
        await bulkDeleteMutation.mutateAsync(selectedStudents);
        setSelectedStudents([]);
        showToast('Students deleted successfully!');
      } catch (err) {
        showToast('Failed to delete students', 'error');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white flex items-center`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 text-white hover:text-gray-200">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {(isLoading || deleteMutation.isPending || updateMutation.isPending) && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700 font-medium">Updating Records...</p>
          </div>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Student Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 font-medium"
          >
            {classes.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition whitespace-nowrap shadow-md hover:shadow-lg flex items-center font-medium"
          >
            Bulk Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap shadow-md hover:shadow-lg font-medium"
          >
            Add New Student
          </button>
          {selectedStudents.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation?.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition whitespace-nowrap shadow-md hover:shadow-lg disabled:opacity-50 font-medium"
            >
              Delete ({selectedStudents.length})
            </button>
          )}
        </div>
      </div>

      {/* Fee Ledger Control Strip */}
      {user?.role === 'admin' && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FiBell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wide">Fee Defaulter Ledger</h3>
              <p className="text-xs text-indigo-700 font-medium">Manage payments & send bulk reminders.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input 
              type="month" 
              value={feeMonth}
              onChange={(e) => setFeeMonth(e.target.value)}
              className="px-4 py-2 border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700 outline-none"
            />
            <button 
              onClick={handleRemindAll}
              disabled={reminding}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg font-bold flex items-center justify-center min-w-[140px]"
            >
              {reminding ? 'Sending...' : 'Remind Pending'}
            </button>
          </div>
        </div>
      )}

      {/* Directory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    onChange={handleSelectAll}
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Father's Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-indigo-50/50">Fee Status ({new Date(feeMonth).toLocaleString('default', { month: 'short' })})</th>
                )}
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
               {filteredStudents.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 7 : 6} className="text-center text-gray-500 py-16">
                    <div className="flex flex-col items-center text-gray-400">
                      <FiUsers size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium text-gray-600">No students found.</p>
                      <p className="text-sm">Try selecting a different class or adding a new student.</p>
                    </div>
                  </td>
                </tr>
              )}

              {filteredStudents.map((student) => {
                const rowId = student._id || student.id;
                const currentFeeStatus = student.feeHistory?.[feeMonth] || 'Pending';

                return (
                <React.Fragment key={rowId}>
                  {editingStudent === rowId ? (
                    <tr className="bg-blue-50/50">
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4">
                        <input name="name" value={editFormData.name} onChange={handleEditFormChange} onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </td>
                      <td className="px-6 py-4">
                        <input name="fatherName" value={editFormData.fatherName} onChange={handleEditFormChange} onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <input name="mobile" value={editFormData.mobile} onChange={handleEditFormChange} onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </td>
                      <td className="px-6 py-4">
                        <select name="classes" value={editFormData.classes} onChange={handleEditFormChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                          {classes.filter(c => c !== 'All Classes').map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
                        </select>
                      </td>
                      {user?.role === 'admin' && <td className="px-6 py-4"></td>}
                      <td className="px-6 py-4 hidden md:table-cell text-right">
                        <button onClick={() => handleEditSubmit(rowId)} className="text-blue-600 font-medium mr-4 hover:text-blue-800">Save</button>
                        <button onClick={() => setEditingStudent(null)} className="text-gray-500 font-medium hover:text-gray-700">Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" checked={selectedStudents.includes(rowId)} onChange={() => handleSelectStudent(rowId)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">Roll: {student.rollNo || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{student.fatherName}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-gray-700 font-mono text-sm">{student.mobile}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold border border-gray-200">{student.classes}</span>
                      </td>
                      
                      {/* Fee Column */}
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 text-center bg-indigo-50/10 group-hover:bg-indigo-50/30 transition">
                          <select 
                            value={currentFeeStatus}
                            onChange={(e) => handleFeeChange(rowId, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border appearance-none text-center min-w-[90px]
                              ${currentFeeStatus === 'Paid' 
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                          >
                            <option value="Paid">✅ Paid</option>
                            <option value="Pending">❌ Pending</option>
                          </select>
                        </td>
                      )}

                      <td className="px-6 py-4 hidden md:table-cell text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleEditClick(student)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => confirmDelete(rowId)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium hidden sm:block">
              Showing <span className="text-gray-900">{(page - 1) * 10 + 1}</span> to <span className="text-gray-900">{Math.min(page * 10, totalStudents)}</span> of <span className="text-gray-900">{totalStudents}</span> students
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition">
                <FiChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold border ${page === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'} transition`}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals remain unchanged structurally */}
      <AnimatePresence>
        {showAddModal && <AddStudentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddStudent={handleAddStudent} classOptions={gradeClasses} existingStudents={students} />}
      </AnimatePresence>
      <AnimatePresence>
        {showImportModal && <BulkImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImportSuccess={handleImportSuccess} />}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={cancelDelete} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full z-10 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Student</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">This action cannot be undone. All related data will be erased.</p>
              <div className="flex justify-end gap-3">
                <button onClick={cancelDelete} className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-bold transition" disabled={deleteMutation.isPending}>Cancel</button>
                <button onClick={() => deleteStudent(showDeleteConfirm)} className="px-5 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 font-bold flex items-center justify-center min-w-24 transition shadow-md shadow-red-500/20" disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentDirectory;