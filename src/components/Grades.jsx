import React, { useState, useContext } from 'react';
import { StudentContext } from '../context/StudentContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiXCircle, FiSave, FiEdit2, FiTrash2, FiUsers, FiBook, FiSend } from 'react-icons/fi';

const Grades = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { students, setStudents } = useContext(StudentContext);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [gradeForm, setGradeForm] = useState({});
  const [totalMarks, setTotalMarks] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...gradeClasses, ...new Set(students.map(student => student.classes).filter(Boolean))];

  const filteredStudents = selectedClass === 'All Classes'
    ? students
    : students.filter(student => student.classes === selectedClass);

  const getStudentGrade = (studentId) => {
    const student = students.find(student => student.id === studentId);
    if (student && student.grades && student.grades[selectedSubject]) {
      return student.grades[selectedSubject];
    }
    return { marks: '', total: totalMarks };
  };

  const handleGradeChange = (studentId, e) => {
    const { name, value } = e.target;
    setGradeForm(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [name]: value
      }
    }));
  };
  const handleMarkSender = async () => {
    try {
        const payload = {
            date: selectedDate, // ✅ New field added here
            students: filteredStudents.map(student => ({
              name: student.name,
              mobile: student.mobile,
              classes: student.classes,
              subject: selectedSubject,
              marks: gradeForm[student.id]?.marks || '',
              total: gradeForm[student.id]?.total || totalMarks,
            }))
      };

      await axios.post(`${backendUrl}/api/notification/notify-parents-mark`, payload);
      toast.success(
        <div className="flex items-center space-x-2">
          <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Marks sended Successfully!</p>
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
          progress: undefined,
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
            <p className="font-medium">Failed to Send Marks</p>
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
          progress: undefined,
          className: "border border-red-200 bg-white shadow-lg rounded-lg",
          bodyClassName: "p-4",
        }
      );
    }
  };

  const handleTotalMarksChange = (e) => {
    const value = parseFloat(e.target.value) || 100;
    setTotalMarks(value);
  };

  const handleSaveGrade = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    const marks = gradeForm[studentId]?.marks || '';
    const total = gradeForm[studentId]?.total || totalMarks;

    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [selectedSubject]: {
              marks,
              total
            }
          }
        };
      }
      return student;
    });

    setStudents(updatedStudents);

    try {
      await axios.post(`${backendUrl}/api/grades/update`, {
        studentId,
        subject: selectedSubject,
        marks,
        total
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Grade Saved Successfully!</p>
            <p className="text-sm text-gray-600">{student.name}'s {selectedSubject} grade saved</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          className: "border border-green-200 bg-white shadow-lg rounded-lg",
        }
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center space-x-2">
          <FiXCircle className="text-red-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Failed to Save Grade</p>
            <p className="text-sm text-gray-600">Please try again later</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          className: "border border-red-200 bg-white shadow-lg rounded-lg",
        }
      );
    }
  };

  const handleDeleteGrade = async (studentId) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const grades = { ...student.grades };
        delete grades[selectedSubject];
        return {
          ...student,
          grades
        };
      }
      return student;
    });

    setStudents(updatedStudents);

    try {
      await axios.delete(`http://localhost:5001/api/grades/delete`, {
        data: { studentId, subject: selectedSubject }
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Grade Deleted Successfully!</p>
            <p className="text-sm text-gray-600">{selectedSubject} grade removed</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          className: "border border-green-200 bg-white shadow-lg rounded-lg",
        }
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center space-x-2">
          <FiXCircle className="text-red-500 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium">Failed to Delete Grade</p>
            <p className="text-sm text-gray-600">Please try again later</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          className: "border border-red-200 bg-white shadow-lg rounded-lg",
        }
      );
    }
  };
  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={() =>
          "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer my-2"
        }
      />
  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Grades Directory</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            {classes.map((cls, index) => (
              <option key={index} value={cls}>
                {cls}
              </option>
            ))}
          </select>
  
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />

           <button
                     onClick={handleMarkSender}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   >
                     <FiSend className="text-lg" />
                     <span>Notify Marks</span>
                   </button>
        </div>
      </div>
  
      <div className="bg-white p-4 rounded-xl flex justify-between items-center border border-blue-100 shadow-sm">
        <div className="bg-[#daeaff] px-4 py-3 rounded-lg border border-blue-100 shadow-xs flex items-center space-x-3 flex-1 max-w-[30%]">
          <div className="bg-blue-100 p-2 rounded-full">
            <FiUsers className="text-blue-600 text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Showing Students</p>
            <p className="text-xl font-bold text-blue-700">
              {filteredStudents.length}
              <span className="text-sm font-normal ml-1 text-gray-500">
                {selectedClass === "All Classes"
                  ? "from all classes"
                  : `in ${selectedClass}`}
              </span>
            </p>
          </div>
        </div>
  
        <div className="bg-[#dee6ff] px-6 py-3 rounded-xl border border-blue-200 shadow-md flex items-center space-x-3 flex-1 max-w-[40%] mx-4">
          <div className="bg-indigo-100 p-2 rounded-full">
            <FiBook className="text-indigo-600 text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Subject</p>
            <p className="text-xl font-bold text-indigo-700">{selectedSubject}</p>
          </div>
        </div>
  
        <div className="bg-[#ddfce7] px-4 py-3 rounded-lg border border-blue-100 shadow-xs flex items-center space-x-3 flex-1 max-w-[30%]">
          <div className="bg-green-100 p-2 rounded-full">
            <FiUsers className="text-green-600 text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-xl font-bold text-green-700">{students.length}</p>
          </div>
        </div>
      </div>
  
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-md overflow-hidden">
          <thead className="bg-blue-100 text-blue-600 text-left text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">STUDENT NAME</th>
              <th className="px-6 py-4">CLASS</th>
              <th className="px-6 py-4">MARKS</th>
              <th className="px-6 py-4">TOTAL</th>
              <th className="px-6 py-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const grade = getStudentGrade(student.id);
              const currentGrade = gradeForm[student.id] || grade;
  
              return (
                <tr key={student.id} className="hover:bg-blue-50 min-h-[64px]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 align-middle">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                    {student.classes}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <input
                      type="number"
                      name="marks"
                      value={currentGrade.marks}
                      onChange={(e) => handleGradeChange(student.id, e)}
                      className="w-24 h-10 px-2 py-1 border rounded text-center focus:ring focus:border-blue-400"
                      placeholder="Marks"
                    />
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <input
                      type="number"
                      name="total"
                      value={currentGrade.total || totalMarks}
                      onChange={(e) => handleGradeChange(student.id, e)}
                      className="w-24 h-10 px-2 py-1 border rounded text-center focus:ring focus:border-blue-400"
                      placeholder="Total"
                    />
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex space-x-2 items-center">
                      <button
                        onClick={() => handleSaveGrade(student.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                      >
                        <FiSave className="mr-1" /> Save
                      </button>
                      <button
                        onClick={() => handleDeleteGrade(student.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
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

export default Grades;