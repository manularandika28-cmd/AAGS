import React, { useState, useEffect } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import API from '../../lib/api';
import {
  Calendar,
  Clock,
  User,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  MapPin,
  X
} from 'lucide-react';

const MeetingScheduler = () => {
  const [meetings, setMeetings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    lecturer_id: '',
    preferred_date: '',
    preferred_time: '',
    purpose: ''
  });
  const [formError, setFormError] = useState('');

  const fetchMeetingData = async () => {
    try {
      setLoading(true);
      const [meetingsRes, lecturersRes] = await Promise.all([
        API.get('/student/meetings'),
        API.get('/student/meetings/lecturers')
      ]);
      setMeetings(meetingsRes.data);
      setLecturers(lecturersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading scheduler data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.lecturer_id || !formData.preferred_date || !formData.preferred_time || !formData.purpose) {
      setFormError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      await API.post('/student/meetings', formData);
      setSubmitting(false);
      setShowModal(false);
      setFormData({ lecturer_id: '', preferred_date: '', preferred_time: '', purpose: '' });
      fetchMeetingData();
    } catch (err) {
      setSubmitting(false);
      setFormError(err.response?.data?.error || 'Failed to submit request.');
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this meeting request?')) return;
    try {
      await API.patch(`/student/meetings/${requestId}/cancel`);
      fetchMeetingData();
    } catch (err) {
      alert('Failed to cancel meeting.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full uppercase">
            <XCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Meeting Scheduler
              </h2>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Request, track, and manage academic advising sessions with lecturers.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Request Meeting
            </button>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-xs">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading your scheduled meetings...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {meetings.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-2 shadow-xs">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No Meetings Found</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You have not scheduled any appointments yet. Click "Request Meeting" above to book time with a lecturer.
                  </p>
                </div>
              ) : (
                meetings.map((m) => (
                  <div
                    key={m.request_id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{m.lecturer_name}</h4>
                          <p className="text-[11px] text-slate-500">{m.department_name} &bull; {m.lecturer_email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(m.status)}
                        {m.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(m.request_id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          {m.status === 'confirmed' ? 'Confirmed Schedule' : 'Requested Schedule'}
                        </span>
                        <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {m.confirmed_date || m.preferred_date}
                          <Clock className="w-3.5 h-3.5 text-slate-400 ml-2" />
                          {m.confirmed_time || m.preferred_time}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Location</span>
                        <div className="font-medium text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {m.location || (m.status === 'confirmed' ? 'To be updated' : 'Pending Confirmation')}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Purpose</span>
                        <p className="text-slate-600 font-medium line-clamp-2">{m.purpose}</p>
                      </div>
                    </div>

                    {m.response && (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs">
                        <span className="font-bold text-slate-700 block mb-0.5">Lecturer Response:</span>
                        <p className="text-slate-600">{m.response}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Request Advisor Meeting</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Lecturer</label>
                <select
                  value={formData.lecturer_id}
                  onChange={(e) => setFormData({ ...formData, lecturer_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Choose a Lecturer --</option>
                  {lecturers.map((l) => (
                    <option key={l.lecturer_id} value={l.lecturer_id}>
                      {l.name} ({l.dep_name || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Time</label>
                  <input
                    type="time"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Purpose</label>
                <textarea
                  rows="3"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Explain why you need to meet (e.g. project evaluation, attendance discussion)..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;