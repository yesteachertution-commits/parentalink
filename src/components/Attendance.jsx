import React, { useState, useContext } from 'react';
import { StudentContext } from '../context/StudentContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiXCircle, FiSend, FiSave } from 'react-icons/fi';

const AttendanceDirectory = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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

  const handleSaveAttendance = async () => {
    const token = localStorage.getItem('token');
    const unmarkedStudents = filteredStudents.filter(
      student => !student.attendance?.[selectedDate]
    );

    if (unmarkedStudents.length > 0) {
      alert("Please mark attendance for all students before saving.");
      return;
    }

    try {
      const payload = {
        date: selectedDate,
        students: filteredStudents.map(student => ({
          id: student.id,
          name: student.name,
          fatherName: student.fatherName,
          mobile: student.mobile,
          classes: student.classes,
          attendance: student.attendance?.[selectedDate],
        }))
      };
      await axios.post(`${backendUrl}/api/save/attendance`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Attendance Saved Successfully!</p>
            <p className="text-sm text-gray-600">Attendance has been saved</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "border border-green-200 bg-white shadow-lg rounded-lg",
          bodyClassName: "p-4",
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center space-x-2">
          <FiXCircle className="text-red-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Failed to Save Attendance</p>
            <p className="text-sm text-gray-600">Please try again later</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "border border-red-200 bg-white shadow-lg rounded-lg",
          bodyClassName: "p-4",
        }
      );
    }
  };

  const handleOpenMarkAttendance = async () => {
    const unmarkedStudents = filteredStudents.filter(
      student => !student.attendance?.[selectedDate]
    );

    if (unmarkedStudents.length > 0) {
      alert("Please mark attendance for all students before saving.");
      return;
    }

    try {
      const payload = {
        date: selectedDate,
        students: filteredStudents.map(student => ({
          name: student.name,
          mobile: student.mobile,
          classes: student.classes,
          attendance: student.attendance?.[selectedDate],
        }))
      };

      await axios.post(`${backendUrl}/api/notification/notify-parents`, payload);
      toast.success(
        <div className="flex items-center space-x-2">
          <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Attendance Marked Successfully!</p>
            <p className="text-sm text-gray-600">Parents have been notified</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "border border-green-200 bg-white shadow-lg rounded-lg",
          bodyClassName: "p-4",
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center space-x-2">
          <FiXCircle className="text-red-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Failed to Send Attendance</p>
            <p className="text-sm text-gray-600">Please try again later</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "border border-red-200 bg-white shadow-lg rounded-lg",
          bodyClassName: "p-4",
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Attendance Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {classes.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
           <button
  onClick={handleSaveAttendance}
  className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex justify-center items-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
>
  <FiSave className="text-lg" />
  <span className="text-center">Save Attendance</span>
</button>

<button
  onClick={handleOpenMarkAttendance}
  className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex justify-center items-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
>
  <FiSend className="text-lg" />
  <span className="text-center">Notify Marks</span>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Student Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider hidden md:table-cell">Father's Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider hidden md:table-cell">Mobile</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const attendanceStatus = getAttendanceStatus(student.id);
              const isPresent = attendanceStatus === 'Present';

              return (
                <tr key={student.id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{student.fatherName}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{student.mobile}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 whitespace-nowrap inline-flex text-xs font-semibold rounded-full ${
                      isPresent
                        ? 'bg-green-100 text-green-800'
                        : attendanceStatus === 'Absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {attendanceStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 ">
                    <button
                      onClick={() => handleToggleAttendance(student.id)}
                      className={`w-full sm:w-auto px-1  py-0.5 md:py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-1 ${
                        isPresent
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isPresent ? (
                        <>
                          <FiXCircle />
                          <span>Mark Absent</span>
                        </>
                      ) : (
                        <>
                          <FiCheckCircle />
                          <span>Mark Present</span>
                        </>
                      )}
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