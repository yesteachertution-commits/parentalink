import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddStudentModal from '../models/AddStudentModal';
import { useStudents, useStudentMutations } from '../hooks/useStudents';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2, FiPlus, FiUsers } from 'react-icons/fi';


const StudentDirectory = () => {
  const [page, setPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  
  const { data, isLoading, isError, refetch } = useStudents({ 
    page, 
    limit: 10, 
    classes: selectedClass 
  });

  const { updateMutation, deleteMutation } = useStudentMutations();

  const students = data?.students || [];
  const totalPages = data?.totalPages || 1;
  const totalStudents = data?.totalStudents || 0;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setPage(1); // Reset to first page when filtering
  };


  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const studentClasses = Array.from(new Set(students.map(s => s.classes)));
  const classes = ['All Classes', ...Array.from(new Set([...gradeClasses, ...studentClasses]))];

  const filteredStudents = students; // Filtering is now handled by the API query


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
      showToast('Student deleted successfully!');
    } catch (err) {
      console.error("Error deleting student:", err);
      showToast('Failed to delete student', 'error');
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
      {/* Modern Toast Notification */}
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
            <button
              onClick={() => setToast({ ...toast, show: false })}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {(isLoading || deleteMutation.isPending || updateMutation.isPending) && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700 font-medium">Updating Records...</p>
          </div>
        </div>
      )}


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Student Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          >
            {classes.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap shadow-md hover:shadow-lg"
          >
            Add New Student
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
        <div>
          <h3 className="font-medium text-blue-800">Showing {filteredStudents.length} students</h3>
          <p className="text-sm text-blue-600">
            {selectedClass === 'All Classes' ? 'Across all classes' : `In ${selectedClass}`}
          </p>
        </div>
        <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm border border-blue-100">
          Total: {totalStudents} students
        </span>
      </div>


      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student Name</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Father's Name</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Roll No.</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase hidden md:table-cell">Mobile</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Class</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase hidden md:table-cell">Actions</th>
  </tr>
</thead>
            <tbody className="bg-white divide-y divide-gray-200">
               {filteredStudents.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-12">
                    <div className="flex flex-col items-center text-gray-400">
                      <FiUsers size={40} className="mb-2 opacity-20" />
                      <p>No students found for {selectedClass}.</p>
                    </div>
                  </td>
                </tr>
              )}

              {filteredStudents.map((student) => {
                const rowId = student._id || student.id;
                return (
                <React.Fragment key={rowId}>
                  {editingStudent === rowId ? (
                    <tr className="bg-blue-50">
                    <td className="px-6 py-4">
                      <input
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        name="fatherName"
                        value={editFormData.fatherName}
                        onChange={handleEditFormChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        name="rollNo"
                        value={editFormData.rollNo}
                        onChange={handleEditFormChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <input
                        name="mobile"
                        value={editFormData.mobile}
                        onChange={handleEditFormChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(rowId)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        name="classes"
                        value={editFormData.classes}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {classes.filter(c => c !== 'All Classes').map((cls, i) => (
                          <option key={i} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <button 
                        onClick={() => handleEditSubmit(rowId)}
                        className="text-green-600 mr-3 hover:text-green-800"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending && editingStudent === rowId ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : 'Save'}
                      </button>
                      <button 
                        onClick={() => setEditingStudent(null)}
                        className="text-gray-600 hover:text-gray-800"
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                  ) : (
                    <tr className="hover:bg-blue-50 transition">
  <td className="px-6 py-4">{student.name}</td>
  <td className="px-6 py-4">{student.fatherName}</td>
  <td className="px-6 py-4">{student.rollNo || '—'}</td>
  <td className="px-6 py-4 hidden md:table-cell">{student.mobile}</td>
  <td className="px-6 py-4">{student.classes}</td>
  <td className="px-6 py-4 hidden md:table-cell">
    <button onClick={() => handleEditClick(student)} className="text-blue-600 mr-4 hover:text-blue-800">Edit</button>
    <button onClick={() => confirmDelete(rowId)} className="text-red-600 hover:text-red-800">Delete</button>
  </td>
</tr>
                  )}
                </React.Fragment>
              );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalStudents)}</span> of <span className="font-medium">{totalStudents}</span> students
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === p
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>


      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddStudent={handleAddStudent}
            classOptions={gradeClasses}
            existingStudents={students}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              className="absolute inset-0 bg-blue-50/50 backdrop-blur-sm"
              onClick={cancelDelete}
            />
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full z-10 border border-blue-100"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this student?</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={cancelDelete} 
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteStudent(showDeleteConfirm)} 
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 flex items-center justify-center min-w-20"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete'}
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