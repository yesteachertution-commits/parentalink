import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token'); // ✅ Fix here
      const response = await axios.get(`${backendUrl}/api/create/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const studentsWithId = response.data.map(student => ({
        ...student,
        id: student._id,
      }));

      setStudents(studentsWithId);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider value={{ students, setStudents, fetchStudents }}>
      {children}
    </StudentContext.Provider>
  );
};