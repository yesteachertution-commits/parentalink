import React, { useState, useEffect } from 'react';
import { useStudents, useStudentMutations, useNotifications } from '../hooks/useStudents';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiXCircle, FiSave, FiEdit2, FiTrash2, FiUsers, FiBook, FiSend } from 'react-icons/fi';


const Grades = ({ readOnly = false }) => {
  const { data, isLoading } = useStudents({ limit: 1000 });
  const { gradeMutation, deleteGradeMutation } = useStudentMutations();
  const { marksNotify } = useNotifications();

  const [localStudents, setLocalStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [gradeForm, setGradeForm] = useState({});
  const [totalMarks, setTotalMarks] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (data?.students) {
      setLocalStudents(data.students);
    }
  }, [data]);

  

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...gradeClasses, ...new Set(localStudents.map(student => student.classes).filter(Boolean))];

  const filteredStudents = selectedClass === 'All Classes'
    ? localStudents
    : localStudents.filter(student => student.classes === selectedClass);


  const getStudentGrade = (studentId) => {
    const student = localStudents.find(student => student.id === studentId);
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
    if (readOnly) return;
    try {
      const payload = {
        date: selectedDate,
        students: filteredStudents.map(student => {
          const grade = getStudentGrade(student.id);
          const currentGrade = gradeForm[student.id] || grade;
          return {
            name: student.name,
            mobile: student.mobile,
            classes: student.classes,
            subject: selectedSubject,
            marks: currentGrade.marks !== undefined ? currentGrade.marks : '',
            total: currentGrade.total || totalMarks,
          };
        })
      };

      await marksNotify.mutateAsync(payload);
      toast.success('Marks sent Successfully!');
    } catch (error) {
      toast.error('Failed to Send Marks');
    }
  };


  const handleTotalMarksChange = (e) => {
    setTotalMarks(e.target.value);
  };

  const handleSaveGrade = async (studentId) => {
    if (readOnly) return;
    const grade = getStudentGrade(studentId);
    const currentGrade = gradeForm[studentId] || grade;
    const marks = currentGrade.marks !== undefined ? currentGrade.marks : '';
    const total = currentGrade.total || totalMarks;

    try {
      await gradeMutation.mutateAsync({
        studentId,
        subject: selectedSubject,
        marks,
        total
      });
      toast.success('Grade Saved Successfully!');
    } catch (error) {
      toast.error('Failed to Save Grade');
    }
  };


  const handleDeleteGrade = async (studentId) => {
    if (readOnly) return;
    try {
      await deleteGradeMutation.mutateAsync({ studentId, subject: selectedSubject });
      toast.success('Grade Deleted Successfully!');
    } catch (error) {
      toast.error('Failed to Delete Grade');
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
        <h2 className="text-2xl font-semibold text-gray-800">{readOnly ? 'Marks' : 'Grades Directory'}</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {!readOnly && (
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
          )}

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
          {!readOnly && (
            <>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={totalMarks}
                onChange={handleTotalMarksChange}
                className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-32"
              />

              <button
                type="button"
                onClick={handleMarkSender}
                disabled={marksNotify.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              >
                <FiSend className="text-lg" />
                <span>{marksNotify.isPending ? 'Sending...' : 'Notify Marks'}</span>
              </button>
            </>
          )}
        </div>
      </div>
  
      <div className={`bg-white p-4 rounded-xl flex justify-between items-center border border-blue-100 shadow-sm ${readOnly ? 'flex-wrap gap-4' : ''}`}>
        <div className={`bg-[#daeaff] px-4 py-3 rounded-lg border border-blue-100 shadow-xs flex items-center space-x-3 flex-1 ${readOnly ? 'max-w-full sm:max-w-[48%]' : 'max-w-[30%]'}`}>
          <div className="bg-blue-100 p-2 rounded-full">
            <FiUsers className="text-blue-600 text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{readOnly ? 'Student' : 'Showing Students'}</p>
            <p className="text-xl font-bold text-blue-700">
              {readOnly && filteredStudents[0]?.name
                ? filteredStudents[0].name
                : (
                  <>
                    {filteredStudents.length}
                    <span className="text-sm font-normal ml-1 text-gray-500">
                      {selectedClass === 'All Classes'
                        ? 'from all classes'
                        : `in ${selectedClass}`}
                    </span>
                  </>
                )}
            </p>
          </div>
        </div>

        <div className={`bg-[#dee6ff] px-6 py-3 rounded-xl border border-blue-200 shadow-md flex items-center space-x-3 flex-1 ${readOnly ? 'max-w-full sm:max-w-[48%]' : 'max-w-[40%] mx-4'}`}>
          <div className="bg-indigo-100 p-2 rounded-full">
            <FiBook className="text-indigo-600 text-lg" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Subject</p>
            <p className="text-xl font-bold text-indigo-700">{selectedSubject}</p>
          </div>
        </div>

        {!readOnly && (
          <div className="bg-[#ddfce7] px-4 py-3 rounded-lg border border-blue-100 shadow-xs flex items-center space-x-3 flex-1 max-w-[30%]">
            <div className="bg-green-100 p-2 rounded-full">
              <FiUsers className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-xl font-bold text-green-700">{localStudents.length}</p>
            </div>
          </div>
        )}
      </div>
  
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-md overflow-hidden">
          <thead className="bg-blue-100 text-blue-600 text-left text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">STUDENT NAME</th>
              <th className="px-6 py-4">CLASS</th>
              <th className="px-6 py-4">MARKS</th>
              <th className="px-6 py-4">TOTAL</th>
              {!readOnly && <th className="px-6 py-4">ACTIONS</th>}
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
                    {readOnly ? (
                      <span className="text-gray-800 font-medium">{currentGrade.marks !== '' && currentGrade.marks != null ? currentGrade.marks : '—'}</span>
                    ) : (
                      <input
                        type="number"
                        name="marks"
                        value={currentGrade.marks}
                        onChange={(e) => handleGradeChange(student.id, e)}
                        className="w-24 h-10 px-2 py-1 border rounded text-center focus:ring focus:border-blue-400"
                        placeholder="Marks"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {readOnly ? (
                      <span className="text-gray-800 font-medium">{currentGrade.total || totalMarks || '—'}</span>
                    ) : (
                      <input
                        type="number"
                        name="total"
                        value={currentGrade.total || totalMarks}
                        onChange={(e) => handleGradeChange(student.id, e)}
                        className="w-24 h-10 px-2 py-1 border rounded text-center focus:ring focus:border-blue-400"
                        placeholder="Total"
                      />
                    )}
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-4 align-middle">
                      <div className="flex space-x-2 items-center">
                        <button
                          type="button"
                          onClick={() => handleSaveGrade(student.id)}
                          disabled={gradeMutation.isPending}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center disabled:opacity-50"
                        >
                          <FiSave className="mr-1" /> {gradeMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGrade(student.id)}
                          disabled={deleteGradeMutation.isPending}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center disabled:opacity-50"
                        >
                          <FiTrash2 className="mr-1" /> {deleteGradeMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  )}
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