import React, { useState, useEffect } from 'react';
import { useStudents, useStudentMutations, useNotifications } from '../hooks/useStudents';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiSave, FiTrash2, FiUsers, FiBook, FiSend } from 'react-icons/fi';

const Grades = ({ readOnly = false }) => {
  const { data } = useStudents({ limit: 1000 });
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
  const classes = ['All Classes', ...gradeClasses, ...new Set(localStudents.map(s => s.classes).filter(Boolean))];

  const filteredStudents =
    selectedClass === 'All Classes'
      ? localStudents
      : localStudents.filter(s => s.classes === selectedClass);

  const getStudentGrade = (studentId) => {
    const student = localStudents.find(s => s.id === studentId);
    if (student?.grades?.[selectedSubject]) {
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
            marks: currentGrade.marks || '',
            total: currentGrade.total || totalMarks,
          };
        })
      };

      await marksNotify.mutateAsync(payload);
      toast.success('Marks sent Successfully!');
    } catch {
      toast.error('Failed to Send Marks');
    }
  };

  const handleSaveGrade = async (studentId) => {
    if (readOnly) return;

    const grade = getStudentGrade(studentId);
    const currentGrade = gradeForm[studentId] || grade;

    try {
      await gradeMutation.mutateAsync({
        studentId,
        subject: selectedSubject,
        marks: currentGrade.marks || '',
        total: currentGrade.total || totalMarks
      });

      toast.success('Grade Saved Successfully!');
    } catch {
      toast.error('Failed to Save Grade');
    }
  };

  const handleDeleteGrade = async (studentId) => {
    if (readOnly) return;

    try {
      await deleteGradeMutation.mutateAsync({
        studentId,
        subject: selectedSubject
      });

      toast.success('Grade Deleted Successfully!');
    } catch {
      toast.error('Failed to Delete Grade');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer autoClose={3000} />

      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">
          {readOnly ? 'Marks' : 'Grades Directory'}
        </h2>

        {!readOnly && (
          <button onClick={handleMarkSender} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <FiSend className="mr-2" />
            {marksNotify.isPending ? 'Sending...' : 'Notify Marks'}
          </button>
        )}
      </div>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Marks</th>
            <th>Total</th>
            {!readOnly && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map(student => {
            const grade = getStudentGrade(student.id);
            const currentGrade = gradeForm[student.id] || grade;

            return (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.classes}</td>

                <td>
                  {readOnly ? (
                    currentGrade.marks || '-'
                  ) : (
                    <input
                      type="number"
                      name="marks"
                      value={currentGrade.marks}
                      onChange={(e) => handleGradeChange(student.id, e)}
                    />
                  )}
                </td>

                <td>
                  {readOnly ? (
                    currentGrade.total || '-'
                  ) : (
                    <input
                      type="number"
                      name="total"
                      value={currentGrade.total || totalMarks}
                      onChange={(e) => handleGradeChange(student.id, e)}
                    />
                  )}
                </td>

                {!readOnly && (
                  <td>
                    <button onClick={() => handleSaveGrade(student.id)}>
                      <FiSave />
                    </button>

                    <button onClick={() => handleDeleteGrade(student.id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;