import React, { useState, useEffect } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import {
  UserCheck,
  UserX,
  Clock,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/admin';

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/users/pending`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load pending users');
      }

      setPendingUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (role, id) => {
    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE}/users/${role}/${id}/approve`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Approval failed');
      }

      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (role, id) => {
    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE}/users/${role}/${id}/reject`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Rejection failed');
      }

      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Pending Approvals
              </h1>
              <p className="text-sm text-white/70 mt-1 font-medium">
                Review and approve new self-registered accounts.
              </p>
            </div>

            <button
              onClick={fetchPending}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">
                    Awaiting Review
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Students and Lecturers who self-registered.
                  </p>
                </div>
              </div>

              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {pendingUsers.length} Pending
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Loading pending accounts...
              </p>
            ) : pendingUsers.length === 0 ? (
              <div className="py-8 text-center">
                <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  No pending registrations. All caught up.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((u) => (
                  <div
                    key={`${u.role}-${u.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        {u.role === 'Student' ? (
                          <GraduationCap className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {u.email}
                        </p>
                      </div>

                      <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                        {u.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(u.role, u.id)}
                        disabled={processingId === u.id}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Reject
                      </button>

                      <button
                        onClick={() => handleApprove(u.role, u.id)}
                        disabled={processingId === u.id}
                        className="flex items-center gap-1.5 bg-[#0A192F] hover:bg-[#1E3A8A] text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        {processingId === u.id ? 'Processing...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};




export default PendingApprovals;