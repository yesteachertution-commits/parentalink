import React, { useState, useContext, useEffect } from 'react';
import { StudentContext } from '../context/StudentContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiXCircle, FiSend, FiSave, FiClock, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AttendanceDirectory = ({ isParentView = false }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { students, setStudents } = useContext(StudentContext);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [view, setView] = useState(() => (isParentView ? 'history' : 'mark'));

  // History drill-down: null = grade list, string = grade selected, object = student selected
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // History: current month/year being viewed
  const now = new Date();
  const [historyMonth, setHistoryMonth] = useState(now.getMonth());
  const [historyYear, setHistoryYear] = useState(now.getFullYear());

  useEffect(() => {
    if (!isParentView || students.length !== 1) return;
    const s = students[0];
    setView('history');
    setSelectedGrade(s.classes || 'Student');
    setSelectedStudent(s);
  }, [isParentView, students]);

  const gradeClasses = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
  const classes = ['All Classes', ...gradeClasses, ...new Set(students.map(s => s.classes).filter(Boolean))];
  const filteredStudents = selectedClass === 'All Classes' ? students : students.filter(s => s.classes === selectedClass);

  const getAttendanceStatus = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.attendance?.[selectedDate] || 'Not Marked';
  };

  const handleToggleAttendance = (studentId) => {
    const current = getAttendanceStatus(studentId);
    const next = current === 'Present' ? 'Absent' : 'Present';
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, attendance: { ...s.attendance, [selectedDate]: next } } : s
    ));
  };

  const handleSaveAttendance = async () => {
    const token = localStorage.getItem('token');
    const unmarked = filteredStudents.filter(s => !s.attendance?.[selectedDate]);
    if (unmarked.length > 0) { alert('Please mark attendance for all students before saving.'); return; }
    setIsSaving(true);
    try {
      await axios.post(`${backendUrl}/api/save/attendance`, {
        date: selectedDate,
        students: filteredStudents.map(s => ({
          id: s.id, name: s.name, fatherName: s.fatherName,
          mobile: s.mobile, classes: s.classes, attendance: s.attendance?.[selectedDate],
        }))
      }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      toast.success('Attendance Saved!', { position: 'top-center', autoClose: 3000 });
    } catch (e) {
      console.error(e);
      toast.error('Failed to Save Attendance', { position: 'top-center', autoClose: 3000 });
    } finally { setIsSaving(false); }
  };

  const handleNotify = async () => {
    const token = localStorage.getItem('token');
    const unmarked = filteredStudents.filter(s => !s.attendance?.[selectedDate]);
    if (unmarked.length > 0) { alert('Please mark attendance for all students before notifying.'); return; }
    setIsNotifying(true);
    try {
      await axios.post(`${backendUrl}/api/notification/notify-parents`, {
        date: selectedDate,
        students: filteredStudents.map(s => ({
          name: s.name, mobile: s.mobile, classes: s.classes, attendance: s.attendance?.[selectedDate],
        }))
      });
      toast.success('Parents notified!', { position: 'top-center', autoClose: 3000 });
    } catch (e) {
      console.error(e);
      toast.error('Failed to Send Attendance', { position: 'top-center', autoClose: 3000 });
    } finally { setIsNotifying(false); }
  };

  // Group students by class
  const groupedByClass = students.reduce((acc, s) => {
    const cls = s.classes || 'Unassigned';
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(s);
    return acc;
  }, {});

  // Calendar helpers
  const monthName = new Date(historyYear, historyMonth).toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(historyYear, historyMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(historyYear, historyMonth, 1).getDay(); // 0=Sun
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    if (historyMonth === 0) { setHistoryMonth(11); setHistoryYear(y => y - 1); }
    else setHistoryMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (historyMonth === 11) { setHistoryMonth(0); setHistoryYear(y => y + 1); }
    else setHistoryMonth(m => m + 1);
  };

  // Format date as YYYY-MM-DD
  const fmtDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;


  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header + toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Attendance</h2>
        {!isParentView && (
          <div className="flex gap-2">
            <button onClick={() => setView('mark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'mark' ? 'bg-blue-600 text-white shadow' : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
              <FiList /> Mark Attendance
            </button>
            <button onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'history' ? 'bg-blue-600 text-white shadow' : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
              <FiClock /> History
            </button>
          </div>
        )}
      </div>

      {/* ── MARK ATTENDANCE VIEW ── */}
      {!isParentView && view === 'mark' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-blue-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500">
              {classes.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
            </select>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-blue-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleSaveAttendance} disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
              {isSaving ? 'Saving...' : <><FiSave /><span>Save Attendance</span></>}
            </button>
            <button onClick={handleNotify} disabled={isNotifying}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
              {isNotifying ? 'Notifying...' : <><FiSend /><span>Notify Attendance</span></>}
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex justify-between border border-blue-100">
            <div>
              <h3 className="font-medium text-blue-800">Showing {filteredStudents.length} students</h3>
              <p className="text-sm text-blue-600">{selectedClass === 'All Classes' ? 'Across all classes' : `In ${selectedClass}`} for {selectedDate}</p>
            </div>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm border border-blue-100">Total: {students.length}</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase hidden md:table-cell">Father's Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase hidden md:table-cell">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map(student => {
                  const status = getAttendanceStatus(student.id);
                  const isPresent = status === 'Present';
                  return (
                    <tr key={student.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{student.fatherName}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{student.mobile}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isPresent ? 'bg-green-100 text-green-800' : status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => handleToggleAttendance(student.id)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${isPresent ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                          {isPresent ? <><FiXCircle /><span>Mark Absent</span></> : <><FiCheckCircle /><span>Mark Present</span></>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ── HISTORY VIEW ── */}
      {(isParentView || view === 'history') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

          {/* Breadcrumb */}
          {!isParentView && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button onClick={() => { setSelectedGrade(null); setSelectedStudent(null); }}
                className={`hover:text-blue-600 ${!selectedGrade ? 'text-blue-600 font-semibold' : ''}`}>
                All Grades
              </button>
              {selectedGrade && <>
                <span>/</span>
                <button onClick={() => setSelectedStudent(null)}
                  className={`hover:text-blue-600 ${selectedGrade && !selectedStudent ? 'text-blue-600 font-semibold' : ''}`}>
                  {selectedGrade}
                </button>
              </>}
              {selectedStudent && <>
                <span>/</span>
                <span className="text-blue-600 font-semibold">{selectedStudent.name}</span>
              </>}
            </div>
          )}
          {isParentView && selectedStudent && (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{selectedStudent.name}</span>
              {selectedStudent.classes ? ` · ${selectedStudent.classes}` : ''}
            </p>
          )}

          {/* Level 1: Grade list */}
          {!isParentView && !selectedGrade && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(groupedByClass).sort().map(cls => {
                const count = groupedByClass[cls].length;
                return (
                  <div key={cls} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{cls}</h3>
                      <p className="text-sm text-gray-400">{count} student{count !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => setSelectedGrade(cls)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Level 2: Student list for selected grade */}
          {!isParentView && selectedGrade && !selectedStudent && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-5 py-3">
                <h3 className="text-white font-semibold">{selectedGrade}</h3>
                <p className="text-blue-100 text-xs">{groupedByClass[selectedGrade]?.length} students</p>
              </div>
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student Name</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-blue-700 uppercase hidden md:table-cell">Father's Name</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-blue-700 uppercase hidden md:table-cell">Mobile</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-blue-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedByClass[selectedGrade]?.map(student => (
                    <tr key={student.id} className="hover:bg-blue-50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{student.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{student.fatherName}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{student.mobile}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => setSelectedStudent(student)}
                          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isParentView && students.length === 0 && (
            <p className="text-center text-gray-500 py-8">No student record linked to this account.</p>
          )}

          {/* Level 3: Monthly calendar for selected student */}
          {selectedStudent && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-5 py-3">
                <h3 className="text-white font-semibold">{selectedStudent.name}</h3>
                <p className="text-blue-100 text-xs">{selectedGrade} · {selectedStudent.mobile}</p>
              </div>
              <div className="p-5 space-y-4">
                {/* Month navigator */}
                <div className="flex items-center justify-center gap-4">
                  <button onClick={prevMonth} className="p-1 rounded-full hover:bg-blue-50 text-blue-600"><FiChevronLeft size={20} /></button>
                  <span className="text-base font-semibold text-gray-800 w-36 text-center">{monthName} {historyYear}</span>
                  <button onClick={nextMonth} className="p-1 rounded-full hover:bg-blue-50 text-blue-600"><FiChevronRight size={20} /></button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1">
                  {dayLabels.map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateStr = fmtDate(historyYear, historyMonth, day);
                    const status = selectedStudent.attendance?.[dateStr];
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    return (
                      <div key={day} className="flex justify-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                          ${status === 'Present' ? 'bg-green-500 text-white' :
                            status === 'Absent' ? 'bg-red-500 text-white' :
                            isToday ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' :
                            'bg-gray-100 text-gray-400'}`}>
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-5 pt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Present</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Absent</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 inline-block" /> No record</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AttendanceDirectory;
