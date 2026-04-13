import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const StudentContext = createContext();

const normalizeStudent = (student) => {
  if (!student) return null;
  const id = student._id || student.id;
  return { ...student, id };
};

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user, token } = useAuth();

  const fetchStudents = useCallback(async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      setStudents([]);
      return;
    }
    const role = user?.role === 'parent' ? 'parent' : 'school';
    try {
      if (role === 'parent') {
        const response = await axios.get(`${backendUrl}/api/parent/child`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const raw = response.data?.student ?? response.data?.data ?? response.data;
        const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
        setStudents(list.map((s) => normalizeStudent(s)).filter(Boolean));
        return;
      }

      const response = await axios.get(`${backendUrl}/api/create/students`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.students || [];

      console.log('GET students rollNo check:', data.map(s => `${s.name}: ${s.rollNo}`));
      setStudents(data.map((student) => normalizeStudent(student)).filter(Boolean));
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudents([]);
    }
  }, [backendUrl, token, user?.role]);

  useEffect(() => {
    setStudents([]);
    fetchStudents();
  }, [fetchStudents]);

  return (
    <StudentContext.Provider value={{ students, setStudents, fetchStudents }}>
      {children}
    </StudentContext.Provider>
  );
};