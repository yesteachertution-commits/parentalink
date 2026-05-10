import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiCheckCircle, FiXCircle, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Analytics = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/pulse`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch admin pulse", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchPulse();
    else setLoading(false);
  }, [token, user]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 font-medium">Analytics overview is restricted to administrators.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const pulse = data?.pulse || { percent: 0, present: 0, absent: 0, total: 0 };
  const teachers = data?.teachers || [];
  const missingRollCall = teachers.filter(t => t.status === 'Missed Roll Call');

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Daily Pulse</h2>
        <p className="text-gray-500 text-sm mt-1">Real-time attendance & accountability telemetry for today.</p>
      </div>

      {/* Massive Widgets for Daily Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-20">
            <FiUsers size={100} />
          </div>
          <p className="text-blue-100 font-medium tracking-wide uppercase text-sm">Today's Attendance</p>
          <div className="flex items-baseline mt-2">
            <span className="text-5xl font-extrabold">{pulse.percent}%</span>
          </div>
          <p className="mt-4 text-blue-100 text-sm font-medium">Overall School Turnout</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">Present</p>
              <h3 className="text-4xl font-extrabold text-gray-800 mt-1">{pulse.present}</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <FiCheckCircle size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 font-medium">Students marked present today</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-2 h-full bg-red-400"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">Absent</p>
              <h3 className="text-4xl font-extrabold text-red-500 mt-1">{pulse.absent}</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-500 rounded-xl">
              <FiXCircle size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 font-medium">Students missing roll call</p>
        </div>
      </div>

      {/* Teacher Accountability Tracker */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiClock className="text-blue-500" />
              Teacher Accountability Tracker
            </h3>
            <p className="text-sm text-gray-500 mt-1">Live status of morning roll call submissions.</p>
          </div>
          {missingRollCall.length > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
              <FiAlertTriangle /> {missingRollCall.length} Pending
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Teacher Name</th>
                <th className="px-6 py-4 font-semibold">Assigned Classes</th>
                <th className="px-6 py-4 font-semibold text-right">Today's Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-8 text-gray-500">No teachers found.</td></tr>
              ) : (
                teachers.map((teacher, idx) => (
                  <tr key={teacher._id || idx} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{teacher.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{teacher.classes}</td>
                    <td className="px-6 py-4 text-right">
                      {teacher.status === 'Submitted' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <FiCheckCircle /> Submitted
                        </span>
                      )}
                      {teacher.status === 'Awaiting Roll Call' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                          <FiClock /> Awaiting Roll Call
                        </span>
                      )}
                      {teacher.status === 'Missed Roll Call' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          <FiAlertTriangle /> Missed Cutoff
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
