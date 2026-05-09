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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-0 md:p-4">
      <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">Attendance by Class (%)</h3>
        <div className="h-60 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="attendance" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">Grade Distribution</h3>
        <div className="h-60 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
