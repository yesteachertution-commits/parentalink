import React, { useState, useEffect } from 'react';
import { useStudents, useStudentMutations, useNotifications } from '../hooks/useStudents';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiSave, FiTrash2, FiUsers, FiBook, FiSend, FiFilter, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Grades = ({ readOnly = false }) => {
  const { user } = useAuth();
  const initialClass = user?.assignedClasses?.[0] || 'All Classes';
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const { data } = useStudents({ limit: 200, classes: selectedClass });
  const { gradeMutation, deleteGradeMutation } = useStudentMutations();
  const { marksNotify } = useNotifications();

  const [localStudents, setLocalStudents] = useState([]);
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FiBook style={{ color: '#2563eb', fontSize: 22 }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>
          {readOnly ? 'Academic Marks' : 'Grade Management'}
        </h2>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Row 1: class + subject selects */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 140px', minWidth: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                <FiUsers size={11} /> Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 12, fontSize: 14, color: '#374151',
                  outline: 'none', appearance: 'auto',
                }}
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ flex: '1 1 140px', minWidth: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                <FiBook size={11} /> Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 12, fontSize: 14, color: '#374151',
                  outline: 'none', appearance: 'auto',
                }}
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: date + notify button (teachers only) */}
          {!readOnly && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  <FiCalendar size={11} /> Exam Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                    borderRadius: 12, fontSize: 14, color: '#374151',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                onClick={handleMarkSender}
                disabled={marksNotify.isPending}
                style={{
                  flex: '1 1 140px', minWidth: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 16px', background: '#2563eb', color: '#fff',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  opacity: marksNotify.isPending ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                }}
              >
                <FiSend size={14} />
                {marksNotify.isPending ? 'Sending...' : 'Notify Parents'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
              {filteredStudents.map((student) => {
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
                        <input type="number" name="marks" value={currentGrade.marks} onChange={(e) => handleGradeChange(sid, e)}
                          className="w-24 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                          placeholder="0" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {readOnly ? (
                        <span className="font-semibold text-gray-700">{currentGrade.total || '—'}</span>
                      ) : (
                        <input type="number" name="total" value={currentGrade.total} onChange={(e) => handleGradeChange(sid, e)}
                          className="w-24 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                          placeholder="100" />
                      )}
                    </td>
                    {!readOnly && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleSaveGrade(sid)} disabled={gradeMutation.isPending} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"><FiSave size={20} /></button>
                          <button onClick={() => handleDeleteGrade(sid)} disabled={deleteGradeMutation.isPending} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={20} /></button>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No students found.</div>
        ) : filteredStudents.map((student) => {
          const sid = student._id || student.id;
          const grade = getStudentGrade(sid);
          const currentGrade = gradeForm[sid] || grade;
          return (
            <div key={sid} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{student.name}</h4>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{student.classes}</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Obtained</div>
                  <div className="text-lg font-bold text-blue-600">{currentGrade.marks || '—'} / {currentGrade.total || '—'}</div>
                </div>
              </div>

              {!readOnly && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="number" name="marks" value={currentGrade.marks} onChange={(e) => handleGradeChange(sid, e)}
                      className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Marks" />
                  </div>
                  <div className="flex-1">
                    <input type="number" name="total" value={currentGrade.total} onChange={(e) => handleGradeChange(sid, e)}
                      className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Total" />
                  </div>
                  <button onClick={() => handleSaveGrade(sid)} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><FiSave size={20} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grades;