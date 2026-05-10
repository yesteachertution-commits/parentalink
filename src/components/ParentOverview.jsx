import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiCreditCard, FiCheckCircle, FiClock, FiAlertCircle, FiChevronDown, FiPlus, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ParentOverview = () => {
    const { token } = useAuth();
    const [student, setStudent] = useState(null);
    const [siblings, setSiblings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaveData, setLeaveData] = useState({ date: new Date().toISOString().split('T')[0], reason: '' });
    const [submittingLeave, setSubmittingLeave] = useState(false);

    const fetchChild = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/parent/child`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSiblings(res.data.siblings || []);
            setStudent(res.data.student);
        } catch (err) {
            console.error("Failed to load child data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChild();
    }, [token]);

    // WebSocket Connection
    useEffect(() => {
        if (!student) return;
        const socket = io(import.meta.env.VITE_BACKEND_URL);
        
        socket.emit('joinRoom', student._id);
        
        socket.on('attendanceUpdate', (data) => {
            fetchChild(); // Silently refresh the feed
        });

        return () => {
            socket.disconnect();
        };
    }, [student?._id]);

    const handleSwitchChild = (id) => {
        const selected = siblings.find(s => s._id === id);
        if (selected) setStudent(selected);
    };

    const handleApplyLeave = async () => {
        if (!leaveData.reason) return alert('Please enter a reason');
        setSubmittingLeave(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/parent/leave`, {
                studentId: student._id,
                ...leaveData
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Leave applied successfully');
            setShowLeaveModal(false);
            fetchChild(); // refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply leave');
        } finally {
            setSubmittingLeave(false);
        }
    };

    // Generate Feed Data
    const feedItems = useMemo(() => {
        if (!student) return [];
        let items = [];
        
        // 1. Attendance
        if (student.attendance) {
            Object.entries(student.attendance).forEach(([date, status]) => {
                items.push({ date, type: 'attendance', title: `Attendance: ${status}`, status });
            });
        }
        
        // 2. Leaves
        if (student.leaveRequests) {
            student.leaveRequests.forEach(req => {
                items.push({ date: req.date, type: 'leave', title: `Leave Request (${req.status})`, desc: req.reason });
            });
        }
        
        // Sort by date descending
        return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [student]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );
    if (!student) return <div className="p-8 text-center text-red-500 font-bold bg-white rounded-2xl shadow-sm">Child profile not found.</div>;

    // Stats calculation
    const attendanceMap = student.attendance || {};
    const days = Object.values(attendanceMap);
    const present = days.filter(v => v === 'Present').length;
    const absent = days.filter(v => v === 'Absent').length;
    const total = present + absent;
    const percent = total === 0 ? 0 : Math.round((present / total) * 100);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const feeStatus = student.feeHistory?.[currentMonth] || 'Pending';
    const isFeePaid = feeStatus === 'Paid';

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            {/* Switcher & Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Viewing Profile</p>
                    {siblings.length > 1 ? (
                        <div className="relative mt-1">
                            <select 
                                className="appearance-none bg-blue-50 text-blue-800 font-bold px-4 py-2 pr-10 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                value={student._id}
                                onChange={(e) => handleSwitchChild(e.target.value)}
                            >
                                {siblings.map(s => (
                                    <option key={s._id} value={s._id}>{s.name} (Roll: {s.rollNo})</option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none" />
                        </div>
                    ) : (
                        <h2 className="text-xl font-bold text-gray-800 mt-1">{student.name}</h2>
                    )}
                </div>
                <button 
                    onClick={() => setShowLeaveModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md font-bold text-sm flex items-center gap-2 transition"
                >
                    <FiPlus /> Leave
                </button>
            </div>

            {/* Main Identity Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <FiUser size={150} />
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shrink-0">
                    <span className="text-3xl font-bold">{student.name.charAt(0)}</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{student.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-3 text-blue-50 text-xs font-bold uppercase tracking-wider">
                        <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">Class: {student.classes || 'N/A'}</span>
                        <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">Roll: {student.rollNo || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-bold uppercase text-xs">Fee Status</h3>
                        <FiCreditCard className={isFeePaid ? 'text-green-500' : 'text-red-500'} size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">{new Date().toLocaleString('default', { month: 'short' })} Fee</p>
                    {isFeePaid ? (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold border border-green-100 w-fit">
                            <FiCheckCircle /> Cleared
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-bold border border-red-100 w-fit">
                            <FiAlertCircle /> Pending
                        </span>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-bold uppercase text-xs">Attendance</h3>
                        <FiClock className="text-blue-500" size={20} />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-800">{percent}%</p>
                    <div className="text-xs font-bold text-gray-500 mt-1">
                        <span className="text-green-600">{present} P</span> / <span className="text-red-500">{absent} A</span>
                    </div>
                </div>
            </div>

            {/* Daily Digest Feed */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Daily Digest Feed</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
                    {feedItems.length === 0 ? (
                        <p className="text-center text-gray-500 p-8 text-sm">No recent activity.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {feedItems.map((item, idx) => (
                                <div key={idx} className="p-4 flex gap-4 items-start hover:bg-gray-50/50 transition">
                                    <div className="flex flex-col items-center mt-1">
                                        <div className={`w-2.5 h-2.5 rounded-full ${item.type === 'attendance' ? (item.status === 'Present' ? 'bg-green-500' : 'bg-red-500') : 'bg-indigo-500'}`} />
                                        {idx !== feedItems.length - 1 && <div className="w-0.5 h-full bg-gray-100 mt-2 min-h-[30px]" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </p>
                                        <p className={`text-sm font-bold ${item.type === 'attendance' ? (item.status === 'Present' ? 'text-green-700' : 'text-red-600') : 'text-indigo-700'}`}>
                                            {item.title}
                                        </p>
                                        {item.desc && <p className="text-sm text-gray-600 mt-1">{item.desc}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Leave Modal */}
            <AnimatePresence>
                {showLeaveModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
                                <button onClick={() => setShowLeaveModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><FiX /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Leave Date</label>
                                    <input type="date" value={leaveData.date} onChange={e => setLeaveData({...leaveData, date: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Reason</label>
                                    <textarea value={leaveData.reason} onChange={e => setLeaveData({...leaveData, reason: e.target.value})} rows={3} placeholder="Sick note or reason for leave..." className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700" />
                                </div>
                                <button onClick={handleApplyLeave} disabled={submittingLeave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3.5 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50">
                                    {submittingLeave ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ParentOverview;
