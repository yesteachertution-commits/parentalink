import React, { useState, useContext } from 'react';
import { StudentContext } from '../context/StudentContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceDirectory = () => {
  const { students, setStudents } = useContext(StudentContext);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...gradeClasses, ...new Set(students.map(student => student.classes).filter(Boolean))];

  const filteredStudents = selectedClass === 'All Classes'
    ? students
    : students.filter(student => student.classes === selectedClass);

  const getAttendanceStatus = (studentId) => {
    const student = students.find(student => student.id === studentId);
    if (student && student.attendance) {
      return student.attendance[selectedDate] || 'Not Marked';
    }
    return 'Not Marked';
  };

  const handleToggleAttendance = (studentId) => {
    const currentStatus = getAttendanceStatus(studentId);
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';

    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [selectedDate]: newStatus,
          },
        };
      }
      return student;
    });

    setStudents(updatedStudents);
  };

  const handleOpenMarkAttendance = async () => {
    try {
      const payload = {
        students: filteredStudents.map(student => ({
          name: student.name,
          mobile: student.mobile,
          classes: student.classes,
          attendance: student.attendance?.[selectedDate] || 'Not Marked',
        }))
      };
  
      await axios.post('http://localhost:5001/api/notification/notify-parents', payload);
      toast.success('Attendance sent successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send attendance');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastClassName={() => "relative flex p-4 rounded-md shadow-lg mb-2"}
        bodyClassName={() => "text-sm font-medium"}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Attendance Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700"
          >
            {classes.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700"
          />

          <button
            onClick={handleOpenMarkAttendance}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Mark Attendance
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex justify-between border border-blue-100">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Father's Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const attendanceStatus = getAttendanceStatus(student.id);
              const isPresent = attendanceStatus === 'Present';

              return (
                <tr key={student.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.fatherName}</td>
                  <td className="px-6 py-4">{student.mobile}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      isPresent 
                        ? 'bg-green-100 text-green-800'
                        : attendanceStatus === 'Absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {attendanceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAttendance(student.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isPresent
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
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
  );
};

export default AttendanceDirectory;