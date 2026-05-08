import React, { useState, useEffect } from 'react';
import { useStudents, useStudentMutations, useNotifications } from '../hooks/useStudents';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiSave, FiTrash2, FiUsers, FiBook, FiSend, FiFilter, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Grades = ({ readOnly = false }) => {
  const { data } = useStudents({ limit: 1000 });
  const { gradeMutation, deleteGradeMutation } = useStudentMutations();
  const { marksNotify } = useNotifications();

  const [localStudents, setLocalStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [gradeForm, setGradeForm] = useState({});
  const [totalMarks, setTotalMarks] = useState('100');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (data?.students) {
      setLocalStudents(data.students);
    }
  }, [data]);

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography', 'Art', 'PE'];
  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...new Set([...gradeClasses, ...localStudents.map(student => student.classes).filter(Boolean)])];

  const filteredStudents = selectedClass === 'All Classes'
    ? localStudents
    : localStudents.filter(student => student.classes === selectedClass);

  const getStudentGrade = (studentId) => {
    const student = localStudents.find(student => (student._id || student.id) === studentId);
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
        ...prev[studentId] || getStudentGrade(studentId),
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
          const sid = student._id || student.id;
          const grade = getStudentGrade(sid);
          const currentGrade = gradeForm[sid] || grade;
          return {
            name: student.name,
            mobile: student.mobile,
            classes: student.classes,
            subject: selectedSubject,
            marks: currentGrade.marks || '',
            total: currentGrade.total || totalMarks,
          };
        })
      };

      await marksNotify.mutateAsync(payload);
      toast.success('Parents notified successfully!');
    } catch {
      toast.error('Failed to notify parents');
    }
  };

  const handleSaveGrade = async (studentId) => {
    if (readOnly) return;

    const sid = studentId;
    const grade = getStudentGrade(sid);
    const currentGrade = gradeForm[sid] || grade;

    try {
      await gradeMutation.mutateAsync({
        studentId: sid,
        subject: selectedSubject,
        marks: currentGrade.marks || '',
        total: currentGrade.total || totalMarks
      });

      toast.success('Grade saved successfully!');
    } catch {
      toast.error('Failed to save grade');
    }
  };

  const handleDeleteGrade = async (studentId) => {
    if (readOnly) return;

    try {
      await deleteGradeMutation.mutateAsync({
        studentId,
        subject: selectedSubject
      });

      toast.success('Grade deleted successfully!');
    } catch {
      toast.error('Failed to delete grade');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBook className="text-blue-600" />
          {readOnly ? 'Academic Marks' : 'Grade Management'}
        </h2>

        {!readOnly && (
          <button 
            onClick={handleMarkSender} 
            disabled={marksNotify.isPending}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            <FiSend />
            {marksNotify.isPending ? 'Sending Notifications...' : 'Notify Parents'}
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <FiUsers /> Select Class
          </label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <FiBook /> Subject
          </label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {!readOnly && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <FiCalendar /> Exam Date
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Obtained Marks</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Marks</th>
                {!readOnly && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No students found for this class.
                  </td>
                </tr>
              ) : filteredStudents.map((student) => {
                const sid = student._id || student.id;
                const grade = getStudentGrade(sid);
                const currentGrade = gradeForm[sid] || grade;

                return (
                  <tr key={sid} className="hover:bg-blue-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.classes}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {readOnly ? (
                        <span className="font-semibold text-gray-700">{currentGrade.marks || '—'}</span>
                      ) : (
                        <input
                          type="number"
                          name="marks"
                          value={currentGrade.marks}
                          onChange={(e) => handleGradeChange(sid, e)}
                          className="w-24 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                          placeholder="0"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {readOnly ? (
                        <span className="font-semibold text-gray-700">{currentGrade.total || '—'}</span>
                      ) : (
                        <input
                          type="number"
                          name="total"
                          value={currentGrade.total}
                          onChange={(e) => handleGradeChange(sid, e)}
                          className="w-24 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                          placeholder="100"
                        />
                      )}
                    </td>
                    {!readOnly && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSaveGrade(sid)}
                            disabled={gradeMutation.isPending}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Save Grade"
                          >
                            <FiSave size={20} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteGrade(sid)}
                            disabled={deleteGradeMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Grade"
                          >
                            <FiTrash2 size={20} />
                          </motion.button>
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
    </div>
  );
};

export default Grades;