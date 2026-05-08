import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const Analytics = ({ students }) => {
  const attendanceData = useMemo(() => {
    if (!students || students.length === 0) return [];
    
    // Calculate attendance percentage per class
    const classData = {};
    students.forEach(student => {
      const cls = student.classes || 'Unassigned';
      if (!classData[cls]) classData[cls] = { total: 0, present: 0 };
      
      const attendance = student.attendance || {};
      const dates = Object.keys(attendance);
      
      dates.forEach(date => {
        classData[cls].total++;
        if (attendance[date] === 'Present') classData[cls].present++;
      });
    });

    return Object.keys(classData).map(cls => ({
      name: cls,
      attendance: classData[cls].total > 0 
        ? Math.round((classData[cls].present / classData[cls].total) * 100) 
        : 0
    }));
  }, [students]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance by Class (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
