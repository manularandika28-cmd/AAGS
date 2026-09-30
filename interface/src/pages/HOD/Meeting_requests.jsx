import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import { createHodMeeting, getHodMeetings, updateHodMeeting } from '../../lib/api';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Search,
  X
} from 'lucide-react';

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled'
};

const getInitials = (name = '') =>
  String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

const getTodayKey = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const formatMeetingTime = (time) => {
  if (!time) return 'Time not set';
  const [hours, minutes] = String(time).split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export default function MeetingRequests() {
  const [meetings, setMeetings] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, confirmedToday: 0, rejected: 0 });
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lecturerSearch, setLecturerSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newMeeting, setNewMeeting] = useState(() => ({
    studentId: '',
    lecturerId: '',
    preferredDate: getTodayKey(),
    preferredTime: '09:00',
    purpose: ''
  }));

  const fetchMeetings = useCallback(async (quiet = false) => {
    try {
      quiet ? setRefreshing(true) : setLoading(true);
      setError('');
      const data = await getHodMeetings();
      setMeetings(Array.isArray(data.meetings) ? data.meetings : []);
      setCounts({
        pending: Number(data.counts?.pending || 0),
        confirmedToday: Number(data.counts?.confirmedToday || 0),
        rejected: Number(data.counts?.rejected || 0)
      });
      setLecturers(Array.isArray(data.lecturers) ? data.lecturers : []);
      setStudents(Array.isArray(data.students) ? data.students : []);
    } catch (fetchError) {
      console.error('HOD meetings error:', fetchError);
      setError(fetchError.message || 'Failed to load meeting requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const filteredMeetings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return meetings;
    return meetings.filter((meeting) =>
      [meeting.studentName, meeting.studentId, meeting.lecturerName, meeting.purpose]
        .some((value) => String(value || '').toLowerCase().includes(term))
    );
  }, [meetings, searchTerm]);

  const filteredLecturers = useMemo(() => {
    const term = lecturerSearch.trim().toLowerCase();
    if (!term) return lecturers;
    return lecturers.filter((lecturer) =>
      [lecturer.name, lecturer.email]
        .some((value) => String(value || '').toLowerCase().includes(term))
    );
  }, [lecturers, lecturerSearch]);

  const todaySchedule = useMemo(() => meetings
    .filter((meeting) =>
      String(meeting.status).toLowerCase() === 'confirmed' &&
      (meeting.confirmedDate || meeting.preferredDate) === getTodayKey()
    )
    .sort((first, second) =>
      String(first.confirmedTime || first.preferredTime || '')
        .localeCompare(String(second.confirmedTime || second.preferredTime || ''))
    ), [meetings]);

  const handleStatusChange = async (requestId, status) => {
    try {
      setActionLoading(requestId);
      setNotice('');
      await updateHodMeeting(requestId, status);
      setNotice(`Meeting request ${status === 'confirmed' ? 'approved' : 'rejected'}.`);
      await fetchMeetings(true);
    } catch (actionError) {
      console.error('HOD meeting update error:', actionError);
      setError(actionError.message || 'Failed to update meeting request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateMeeting = async (event) => {
    event.preventDefault();
    try {
      setCreating(true);
      setError('');
      await createHodMeeting(newMeeting);
      setNotice('Meeting request created.');
      setShowCreateForm(false);
      setNewMeeting({
        studentId: '',
        lecturerId: '',
        preferredDate: getTodayKey(),
        preferredTime: '09:00',
        purpose: ''
      });
      await fetchMeetings(true);
    } catch (createError) {
      console.error('HOD meeting creation error:', createError);
      setError(createError.message || 'Failed to create meeting request');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Topnavbar />
        <main className="p-8 space-y-6 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Meeting Request Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">Review meeting requests and view your department’s confirmed schedule.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 bg-[#051E3D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">
                <Plus className="w-4 h-4" /> New Event
              </button>
              <button
                type="button"
                onClick={() => fetchMeetings(true)}
                disabled={refreshing || loading}
                className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-between gap-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-sm">
              <span>{error}</span>
              <button type="button" onClick={() => fetchMeetings()} className="font-semibold underline">Try again</button>
            </div>
          )}
          {notice && <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-sm">{notice}</p>}

          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <form onSubmit={handleCreateMeeting} className="relative w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-2xl">
                <button type="button" aria-label="Close form" onClick={() => setShowCreateForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
                <h2 className="text-lg font-bold text-slate-900">Schedule New Meeting</h2>
                <label className="block text-xs font-semibold text-slate-700">Student
                  <select required value={newMeeting.studentId} onChange={(event) => setNewMeeting({ ...newMeeting, studentId: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2">
                    <option value="">Select a department student</option>
                    {students.map((student) => <option key={student.id} value={student.id}>{student.name} ({student.id})</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-700">Lecturer
                  <select required value={newMeeting.lecturerId} onChange={(event) => setNewMeeting({ ...newMeeting, lecturerId: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2">
                    <option value="">Select a department lecturer</option>
                    {lecturers.map((lecturer) => <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-slate-700">Date
                    <input required type="date" min={getTodayKey()} value={newMeeting.preferredDate} onChange={(event) => setNewMeeting({ ...newMeeting, preferredDate: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">Time
                    <input required type="time" value={newMeeting.preferredTime} onChange={(event) => setNewMeeting({ ...newMeeting, preferredTime: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2" />
                  </label>
                </div>
                <label className="block text-xs font-semibold text-slate-700">Topic
                  <textarea required maxLength={500} value={newMeeting.purpose} onChange={(event) => setNewMeeting({ ...newMeeting, purpose: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2" rows="3" />
                </label>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                  <button type="submit" disabled={creating || students.length === 0 || lecturers.length === 0} className="rounded-md bg-[#051E3D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{creating ? 'Saving...' : 'Save Meeting'}</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-full"><Clock className="w-6 h-6" /></div>
              <div><span className="text-xs font-medium text-slate-500 block">Pending Requests</span><span className="text-2xl font-bold text-slate-900">{counts.pending}</span></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>
              <div><span className="text-xs font-medium text-slate-500 block">Approved Today</span><span className="text-2xl font-bold text-slate-900">{counts.confirmedToday}</span></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
              <div><span className="text-xs font-medium text-slate-500 block">Rejected Requests</span><span className="text-2xl font-bold text-slate-900">{counts.rejected}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-800">Department Meeting Requests</h2>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search student or topic..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-56 pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              {loading ? (
                <p className="p-10 text-center text-sm text-slate-500">Loading meeting requests...</p>
              ) : filteredMeetings.length === 0 ? (
                <p className="p-10 text-center text-sm text-slate-500">No meeting requests found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Student</th>
                        <th className="px-5 py-3 font-semibold">Topic / Lecturer</th>
                        <th className="px-5 py-3 font-semibold">Proposed time</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMeetings.map((meeting) => {
                        const status = String(meeting.status || 'pending').toLowerCase();
                        const pending = status === 'pending';
                        return (
                          <tr key={meeting.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">{getInitials(meeting.studentName)}</div>
                                <div><div className="font-semibold text-slate-900">{meeting.studentName || 'Unknown Student'}</div><div className="text-[10px] text-slate-400">{meeting.studentId || 'ID unavailable'}</div></div>
                              </div>
                            </td>
                            <td className="px-5 py-4 max-w-[220px]">
                              <div className="font-medium text-slate-700">{meeting.purpose || 'No topic provided'}</div>
                              <div className="text-[10px] text-slate-400 mt-1">{meeting.lecturerName || 'Lecturer unavailable'}</div>
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{meeting.preferredDate || 'Date unset'} · {formatMeetingTime(meeting.preferredTime)}</td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block ${status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : status === 'rejected' || status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                {statusLabels[status] || status}
                              </span>
                              {meeting.response && <p className="mt-1 max-w-40 text-[10px] text-slate-400">{meeting.response}</p>}
                            </td>
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              {pending ? (
                                <div className="inline-flex gap-2">
                                  <button type="button" onClick={() => handleStatusChange(meeting.id, 'confirmed')} disabled={actionLoading === meeting.id} className="px-2.5 py-1.5 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50">Approve</button>
                                  <button type="button" onClick={() => handleStatusChange(meeting.id, 'rejected')} disabled={actionLoading === meeting.id} className="px-2.5 py-1.5 rounded-md border border-rose-300 text-rose-600 font-semibold hover:bg-rose-50 disabled:opacity-50">Reject</button>
                                </div>
                              ) : <span className="text-slate-400">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <div className="space-y-6">
              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-indigo-600" /><h2 className="font-bold text-slate-800 text-sm">Confirmed Schedule Today</h2></div>
                <div className="mt-4 space-y-3">
                  {todaySchedule.length === 0 ? <p className="text-xs text-slate-500">No confirmed meetings scheduled today.</p> : todaySchedule.slice(0, 5).map((meeting) => (
                    <div key={meeting.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex justify-between gap-2"><span className="font-semibold text-xs text-slate-800">{meeting.studentName || 'Student'}</span><span className="text-[10px] font-bold text-slate-500">{formatMeetingTime(meeting.confirmedTime || meeting.preferredTime)}</span></div>
                      <p className="text-[11px] text-slate-500 mt-1">{meeting.purpose || 'Meeting'} · {meeting.lecturerName || 'Lecturer'}</p>
                      {meeting.location && <p className="text-[10px] text-slate-400 mt-1">{meeting.location}</p>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="font-bold text-slate-800 text-sm">Department Lecturer Schedules</h2>
                <div className="mt-4 space-y-3">
                  {filteredLecturers.length === 0 ? <p className="text-xs text-slate-500">No lecturers found.</p> : filteredLecturers.map((lecturer) => (
                    <div key={lecturer.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">{getInitials(lecturer.name)}</div><div className="min-w-0"><div className="font-bold text-xs text-slate-800 truncate">{lecturer.name}</div><div className="text-[10px] text-slate-400 truncate">{lecturer.email || 'Department lecturer'}</div></div></div>
                      <span className="text-[10px] text-slate-500 text-right">{lecturer.scheduleStatus}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 relative"><Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" placeholder="Search lecturers..." value={lecturerSearch} onChange={(event) => setLecturerSearch(event.target.value)} className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-indigo-500" /></div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}