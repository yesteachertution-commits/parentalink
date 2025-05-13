import React, { useState } from 'react';
import Grades from './Grades';
import Attendance from './Attendance';
import StudentList from './StudentList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('grades');

  const renderContent = () => {
    switch (activeTab) {
      case 'grades':
        return <Grades />;
      case 'attendance':
        return <Attendance />;
      case 'students':
        return <StudentList />;
      default:
        return <Grades />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex gap-4 border-b pb-2">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'grades' ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          onClick={() => setActiveTab('grades')}
        >
          Grades
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'attendance' ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'students' ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          onClick={() => setActiveTab('students')}
        >
          Student List
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
