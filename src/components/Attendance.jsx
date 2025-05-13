import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentContext } from '../context/StudentContext';

const AttendanceDirectory = () => {
  const { students, setStudents } = useContext(StudentContext);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);

  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...gradeClasses, ...new Set(students.map(student => student.classes).filter(Boolean))];

  const filteredStudents = selectedClass === 'All Classes'
    ? students
    : students.filter(student => student.classes === selectedClass);

  const handleToggleAttendance = (studentId) => {
    const currentStatus = getAttendanceStatus(studentId);
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return { ...student, attendance: { ...student.attendance, [selectedDate]: newStatus } };
      }
      return student;
    });

    setStudents(updatedStudents);
  };

  const handleBulkMarkPresent = () => {
    const updatedStudents = students.map(student => {
      if (selectedClass === 'All Classes' || student.classes === selectedClass) {
        return { ...student, attendance: { ...student.attendance, [selectedDate]: 'Present' } };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowMarkAttendance(false);
  };

  const getAttendanceStatus = (studentId) => {
    const student = students.find(student => student.id === studentId);
    if (student && student.attendance) {
      return student.attendance[selectedDate] || 'Not Marked';
    }
    return 'Not Marked';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Attendance Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              {classes.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            />
          </div>
          <button
            onClick={() => setShowMarkAttendance(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap shadow-md hover:shadow-lg"
          >
            Mark Attendance
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
        <div>
          <h3 className="font-medium text-blue-800">Showing {filteredStudents.length} students</h3>
          <p className="text-sm text-blue-600">
            {selectedClass === 'All Classes' ? 'Across all classes' : `In ${selectedClass}`} for {selectedDate}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Father's Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const attendanceStatus = getAttendanceStatus(student.id);
                const isPresent = attendanceStatus === 'Present';
                
                return (
                  <tr key={student.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.fatherName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isPresent 
                          ? 'bg-green-100 text-green-800'
                          : attendanceStatus === 'Absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {attendanceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAttendance(student.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isPresent
                            ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
                            : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
                        }`}
                      >
                        {isPresent ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showMarkAttendance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
              onClick={() => setShowMarkAttendance(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance for {selectedDate}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {classes.map((cls, index) => (
                        <option key={index} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowMarkAttendance(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkMarkPresent}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Mark All Present
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceDirectory;