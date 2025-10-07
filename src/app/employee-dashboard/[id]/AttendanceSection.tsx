import React, { useState, useEffect } from 'react';

interface AttendanceSectionProps {
  candidateId: string;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ candidateId }) => {
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [todayStatus, setTodayStatus] = useState<any>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    date: '',
    requestedPunchIn: '',
    requestedPunchOut: '',
    reason: ''
  });
  const [currentSessionTimer, setCurrentSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Fetch attendance data on mount
  useEffect(() => {
    fetchTodayStatus();
    fetchMonthlyAttendance();
    fetchAttendanceSummary();
  }, [candidateId]);

  // Timer effect for current session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && todayStatus?.punchInTime && !todayStatus?.punchOutTime) {
      interval = setInterval(() => {
        const now = new Date();
        const punchIn = new Date(todayStatus.punchInTime);
        const diff = Math.floor((now.getTime() - punchIn.getTime()) / 1000);
        setCurrentSessionTimer(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, todayStatus]);

  const fetchTodayStatus = async () => {
    try {
      const response = await fetch('/api/attendance/today');
      if (response.ok) {
        const data = await response.json();
        setTodayStatus(data);
        setIsTimerRunning(data.hasRecord && data.punchInTime && !data.punchOutTime);
      }
    } catch (error) {
      console.error('Error fetching today status:', error);
    }
  };

  const fetchMonthlyAttendance = async () => {
    const now = new Date();
    try {
      const response = await fetch(`/api/attendance/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.calendarData);
      }
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
    }
  };

  const fetchAttendanceSummary = async () => {
    try {
      const response = await fetch('/api/attendance/summary');
      if (response.ok) {
        const data = await response.json();
        setAttendanceSummary(data);
      }
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };

  const handlePunchIn = async () => {
    setAttendanceLoading(true);
    try {
      const response = await fetch('/api/attendance/punch-in', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        alert(`Punched in at ${new Date(data.punchInTime).toLocaleTimeString()}`);
        await fetchTodayStatus();
        await fetchMonthlyAttendance();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error punching in');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setAttendanceLoading(true);
    try {
      const response = await fetch('/api/attendance/punch-out', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        alert(`Punched out at ${new Date(data.punchOutTime).toLocaleTimeString()}\nTotal hours: ${data.totalHours}`);
        setIsTimerRunning(false);
        await fetchTodayStatus();
        await fetchMonthlyAttendance();
        await fetchAttendanceSummary();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error punching out');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/attendance/correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(correctionForm)
      });

      if (response.ok) {
        alert('Correction request submitted successfully');
        setShowCorrectionForm(false);
        setCorrectionForm({ date: '', requestedPunchIn: '', requestedPunchOut: '', reason: '' });
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error submitting correction request');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'half-day': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      case 'week-off': return 'bg-gray-500';
      case 'holiday': return 'bg-blue-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Attendance Management</h3>

      {/* Today's Status */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium text-white mb-3">Today's Status</h4>
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            {todayStatus?.hasRecord ? (
              <div>
                <p>Status: <span className={`px-2 py-1 rounded text-sm ${getStatusColor(todayStatus.status)}`}>{todayStatus.status}</span></p>
                {todayStatus.punchInTime && <p>Punch In: {new Date(todayStatus.punchInTime).toLocaleTimeString()}</p>}
                {todayStatus.punchOutTime && <p>Punch Out: {new Date(todayStatus.punchOutTime).toLocaleTimeString()}</p>}
                {todayStatus.totalHours > 0 && <p>Total Hours: {todayStatus.totalHours}</p>}
                {isTimerRunning && <p className="text-cyan-400">Current Session: {formatTime(currentSessionTimer)}</p>}
              </div>
            ) : (
              <p>No attendance record for today</p>
            )}
          </div>
          <div className="flex gap-2">
            {!todayStatus?.punchInTime && (
              <button
                onClick={handlePunchIn}
                disabled={attendanceLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {attendanceLoading ? 'Processing...' : 'Punch In'}
              </button>
            )}
            {todayStatus?.punchInTime && !todayStatus?.punchOutTime && (
              <button
                onClick={handlePunchOut}
                disabled={attendanceLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {attendanceLoading ? 'Processing...' : 'Punch Out'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {attendanceSummary && (
        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-medium text-white mb-3">Monthly Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{attendanceSummary.summary.present}</div>
              <div className="text-sm text-slate-300">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{attendanceSummary.summary['half-day']}</div>
              <div className="text-sm text-slate-300">Half-day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{attendanceSummary.summary.absent}</div>
              <div className="text-sm text-slate-300">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{attendanceSummary.presentPercentage}%</div>
              <div className="text-sm text-slate-300">Attendance %</div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Request */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-medium text-white">Correction Request</h4>
          <button
            onClick={() => setShowCorrectionForm(!showCorrectionForm)}
            className="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
          >
            {showCorrectionForm ? 'Cancel' : 'Request Correction'}
          </button>
        </div>

        {showCorrectionForm && (
          <form onSubmit={handleCorrectionSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={correctionForm.date}
                onChange={(e) => setCorrectionForm({...correctionForm, date: e.target.value})}
                className="w-full px-3 py-2 bg-slate-600 text-white rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Requested Punch In</label>
                <input
                  type="time"
                  value={correctionForm.requestedPunchIn}
                  onChange={(e) => setCorrectionForm({...correctionForm, requestedPunchIn: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Requested Punch Out</label>
                <input
                  type="time"
                  value={correctionForm.requestedPunchOut}
                  onChange={(e) => setCorrectionForm({...correctionForm, requestedPunchOut: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Reason</label>
              <textarea
                value={correctionForm.reason}
                onChange={(e) => setCorrectionForm({...correctionForm, reason: e.target.value})}
                className="w-full px-3 py-2 bg-slate-600 text-white rounded"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AttendanceSection;
