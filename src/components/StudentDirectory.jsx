import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddStudentModal from '../models/AddStudentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentDirectory = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    classes: ''
  });

  const [students, setStudents] = useState([]);
  const [toastMessage, setToastMessage] = useState(''); // <-- Toast state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/create/students`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [backendUrl]);

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
    setShowAddModal(false);
  };

  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...gradeClasses, ...new Set(students.map(student => student.classes))];

  const filteredStudents = selectedClass === 'All Classes'
    ? students
    : students.filter(student => student.classes === selectedClass);

  const handleEditClick = (student) => {
    setEditingStudent(student._id);
    setEditFormData({
      name: student.name,
      fatherName: student.fatherName,
      mobile: student.mobile,
      classes: student.classes
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${backendUrl}/api/create/students/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const updatedStudents = students.map(student =>
        student._id === id ? { ...student, ...editFormData } : student
      );
      setStudents(updatedStudents);
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update student.");
    }
  };

  const confirmDelete = (id) => setShowDeleteConfirm(id);
  const cancelDelete = () => setShowDeleteConfirm(null);

  const deleteStudent = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${backendUrl}/api/create/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStudents(students.filter(student => student._id !== id));
      setShowDeleteConfirm(null);

      setToastMessage('Student deleted successfully!');
      setTimeout(() => setToastMessage(''), 3000);  // Hide toast after 3 sec
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student.");
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Student Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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
          Total: {students.length} students
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Father's Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <React.Fragment key={student._id}>
                  {editingStudent === student._id ? (
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4">
                        <input name="name" value={editFormData.name} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <input name="fatherName" value={editFormData.fatherName} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <input name="mobile" value={editFormData.mobile} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <select name="classes" value={editFormData.classes} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded">
                          {classes.filter(c => c !== 'All Classes').map((cls, i) => (
                            <option key={i} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEditSubmit(student._id)} className="text-green-600 mr-3">Save</button>
                        <button onClick={() => setEditingStudent(null)} className="text-gray-600">Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.fatherName}</td>
                      <td className="px-6 py-4">{student.mobile}</td>
                      <td className="px-6 py-4">{student.classes}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEditClick(student)} className="text-blue-600 mr-4">Edit</button>
                        <button onClick={() => confirmDelete(student._id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddStudent={handleAddStudent}
            classOptions={gradeClasses}
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
              className="relative bg-white/95 p-6 rounded-xl shadow-xl max-w-md w-full mx-4 border border-blue-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {students.find(s => s._id === showDeleteConfirm)?.name}'s record?
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={() => deleteStudent(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
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