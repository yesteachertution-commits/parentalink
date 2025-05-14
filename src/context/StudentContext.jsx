import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  // Define fetchStudents function here
  const fetchStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/create/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Normalize _id to id
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
    fetchStudents(); // Optionally call fetch on component mount to load initial data
  }, []);

  return (
    <StudentContext.Provider value={{ students, setStudents, fetchStudents }}>
      {children}
    </StudentContext.Provider>
  );
};