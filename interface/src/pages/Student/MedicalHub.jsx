import React, { useState, useEffect, useRef } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import API from '../../lib/api';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Lock,
  XCircle,
  Loader2,
  AlertCircle,
  History,
  FileCheck
} from 'lucide-react';

const MedicalHub = () => {
  const [medicals, setMedicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const fetchMedicals = async () => {
    try {
      setLoading(true);
      const res = await API.get('/student/medicals');
      setMedicals(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load medical submissions:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicals();
  }, []);

  // Separate active (pending) submission from historical completed ones
  const activeSubmission = medicals.find((m) => m.status === 'pending') || medicals[0] || null;
  const pastSubmissions = medicals.slice(0, 5);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setAdditionalDetails('');
    setFile(null);
    setFormError('');
    setFormSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!startDate || !endDate) {
      setFormError('Please select both a Start Date and an End Date.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setFormError('End date cannot be earlier than Start date.');
      return;
    }
    if (!reason) {
      setFormError('Please select a reason for absence.');
      return;
    }

    const formData = new FormData();
    formData.append('date_from', startDate);
    formData.append('date_to', endDate);
    formData.append(
      'description',
      reason + (additionalDetails ? ` - ${additionalDetails}` : '')
    );
    if (file) {
      formData.append('document', file);
    }

    try {
      setSubmitting(true);
      await API.post('/student/medicals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitting(false);
      setFormSuccess('Medical certificate submitted successfully.');
      handleReset();
      fetchMedicals();
    } catch (err) {
      setSubmitting(false);
      setFormError(err.response?.data?.error || 'Failed to submit medical request.');
    }
  };

  const formatSubDate = (dStr) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topnavbar />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Medical Submission Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Submit official medical documents and monitor your departmental clearance status.
            </p>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center space-y-3 shadow-xs">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading medical portal...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* LEFT CARD: New Submission Form */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center space-x-2.5 pb-6 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-slate-700" />
                  <h3 className="font-extrabold text-lg text-slate-900">New Submission</h3>
                </div>

                {formError && (
                  <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {formSuccess}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Dates Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Reason Dropdown */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      Reason for Absence
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                    >
                      <option value="">Select reason...</option>
                      <option value="General Illness">General Illness (Fever, Viral, etc.)</option>
                      <option value="Hospitalization">Hospitalization / Inward Care</option>
                      <option value="Surgery/Procedure">Surgery / Clinical Procedure</option>
                      <option value="Contagious Infection">Contagious Infection / Quarantine</option>
                      <option value="Other Medical">Other Certified Medical Reason</option>
                    </select>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="Provide any necessary context..."
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all resize-none"
                    />
                  </div>

                  {/* Drag and Drop Upload */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      Upload Medical Certificate
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragOver
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-slate-200 bg-slate-50/30 hover:border-slate-300'
                      }`}
                    >
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-700 font-medium">
                        <span className="font-bold text-slate-900">Drag and drop file here</span> or{' '}
                        <span className="text-blue-600 underline">browse</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Supported formats: PDF, JPG, PNG (Max 5MB)
                      </p>

                      {file && (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-[#051E3D] hover:bg-[#072852] text-white text-xs font-extrabold tracking-wide uppercase transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          SUBMITTING...
                        </>
                      ) : (
                        'SUBMIT MEDICAL'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT RAIL: Status & History */}
              <div className="space-y-6">

                {/* Bottom Right: Past Submissions */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <History className="w-4 h-4 text-slate-700" />
                    <h3 className="font-extrabold text-sm text-slate-900">Past Submissions</h3>
                  </div>

                  {pastSubmissions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No past records found.</p>
                  ) : (
                    <div className="space-y-3">
                      {pastSubmissions.map((sub, idx) => {
                        const isApproved = sub.status?.toLowerCase() === 'approved';
                        const isRejected = sub.status?.toLowerCase() === 'rejected';

                        return (
                          <div
                            key={sub.submission_id || idx}
                            className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {isApproved ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : isRejected ? (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                              )}

                              <div>
                                <p className="font-bold text-slate-800">
                                  {formatSubDate(sub.date_from)} &ndash; {formatSubDate(sub.date_to)}
                                </p>
                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                  {sub.description || 'General Illness'}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                isApproved
                                  ? 'text-emerald-600 bg-emerald-50'
                                  : isRejected
                                  ? 'text-rose-600 bg-rose-50'
                                  : 'text-amber-600 bg-amber-50'
                              }`}
                            >
                              {sub.status || 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 text-center border-t border-slate-100">
                    <button
                      type="button"
                      className="text-[11px] font-extrabold text-[#051E3D] tracking-wider uppercase hover:underline"
                    >
                      View All History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicalHub;