import React, { useEffect, useMemo, useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import { useAuth } from '../../context/AuthContext';
import { getHodMedicalReviews, updateHodMedicalReview } from '../../lib/api';

import {
  Search,
  Clock,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  CornerUpRight,
  ZoomIn,
  FileText
} from 'lucide-react';

export default function MedicalReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { accessToken, loading: authLoading } = useAuth();

  const [medicalData, setMedicalData] = useState({
    counts: {
      pending: 0,
      approvedThisMonth: 0
    },
    submissions: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // =========================================================
  // GET HOD MEDICAL REVIEW DATA
  // =========================================================

  const fetchMedicalReview = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getHodMedicalReviews();

      setMedicalData({
        counts: {
          pending: Number(data.counts?.pending || 0),
          approvedThisMonth: Number(
            data.counts?.approvedThisMonth || 0
          )
        },

        submissions: Array.isArray(data.submissions)
          ? data.submissions
          : []
      });
    } catch (error) {
      console.error('Medical review error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    if (authLoading) return undefined;

    if (!accessToken) {
      setError('You must be signed in to view medical reviews.');
      setLoading(false);
      return undefined;
    }

    fetchMedicalReview();
    return undefined;
  }, [accessToken, authLoading]);

  // =========================================================
  // APPROVE MEDICAL SUBMISSION
  // =========================================================

  const handleApprove = async (submissionId) => {
    try {
      setActionLoading(submissionId);

      const data = await updateHodMedicalReview(submissionId, 'approved');
      alert(data.message || 'Medical certificate approved successfully.');

      await fetchMedicalReview();
    } catch (error) {
      console.error('Approve error:', error);
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // REJECT MEDICAL SUBMISSION
  // =========================================================

  const handleReject = async (submissionId) => {
    try {
      setActionLoading(submissionId);

      const data = await updateHodMedicalReview(submissionId, 'rejected');
      alert(data.message || 'Medical certificate rejected.');

      await fetchMedicalReview();
    } catch (error) {
      console.error('Reject error:', error);
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredSubmissions = useMemo(() => {
    const submissions = medicalData?.submissions || [];
    const visibleByStatus = statusFilter === 'all'
      ? submissions
      : submissions.filter((item) =>
          String(item.hodStatus ?? item.approvalStatus ?? item.status ?? 'pending')
            .toLowerCase() === statusFilter
        );

    if (!searchTerm.trim()) {
      return visibleByStatus;
    }

    const search = searchTerm.toLowerCase();

    return visibleByStatus.filter((item) =>
      String(item.studentName || '')
        .toLowerCase()
        .includes(search) ||

      String(item.studentId || '')
        .toLowerCase()
        .includes(search) ||

      String(item.courseCode || '')
        .toLowerCase()
        .includes(search) ||

      String(item.courseName || '')
        .toLowerCase()
        .includes(search) ||

      String(item.description || '')
        .toLowerCase()
        .includes(search) ||

      String(item.lecturer || '')
        .toLowerCase()
        .includes(search)
    );
  }, [medicalData.submissions, searchTerm, statusFilter]);

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleDateString();
  };

  // =========================================================
  // STUDENT INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name) {
      return 'ST';
    }

    return String(name)
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex h-screen text-slate-800 font-sans antialiased overflow-hidden">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidenavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex-1 flex flex-col overflow-y-auto">

        <main className="p-8 space-y-6 max-w-7xl">

          {/* =================================================
              HEADER & METRICS
          ================================================== */}

          <div className="flex items-start justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                HOD Medical Review
              </h1>

              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Review and process forwarded medical certificates
                from academic staff.
              </p>
            </div>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="flex gap-4">

              {/* Pending */}

              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 w-48">

                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 leading-tight block">
                    Pending HOD Review
                  </span>

                  <span className="text-2xl font-black text-slate-900">
                    {medicalData.counts.pending}
                  </span>
                </div>

              </div>

              {/* Approved */}

              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 w-48">

                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 leading-tight block">
                    Approved This Month
                  </span>

                  <span className="text-2xl font-black text-slate-900">
                    {medicalData.counts.approvedThisMonth}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH + QUEUE
          ================================================== */}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            {/* =================================================
                QUEUE HEADER
            ================================================== */}

            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">

              <div className="flex items-center gap-2">

                <FileText className="w-4 h-4 text-slate-700" />

                <h3 className="font-bold text-slate-800 text-sm">
                  Forwarded Queue
                </h3>

              </div>

              <div className="flex items-center gap-2">

                {/* Search */}

                <div className="relative">

                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-8 pr-3 py-1.5 w-48 border border-slate-200 rounded-md text-xs outline-none focus:ring-1 focus:ring-slate-300"
                  />

                </div>

                {/* Filter */}

                <select
                  aria-label="Filter medical submissions by status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="border border-slate-200 bg-white px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 outline-none focus:ring-1 focus:ring-slate-300"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

              </div>

            </div>

            {/* =================================================
                LOADING
            ================================================== */}

            {loading && (
              <div className="p-10 text-center">

                <div className="inline-flex items-center gap-2 text-sm text-slate-500">

                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />

                  Loading medical submissions...

                </div>

              </div>
            )}

            {/* =================================================
                ERROR
            ================================================== */}

            {!loading && error && (
              <div className="p-6">

                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-4 text-sm">

                  <p className="font-semibold mb-1">
                    Failed to load medical reviews
                  </p>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchMedicalReview}
                    className="mt-3 px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs font-semibold hover:bg-rose-700"
                  >
                    Try Again
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                NO RESULTS
            ================================================== */}

            {!loading &&
              !error &&
              filteredSubmissions.length === 0 && (
                <div className="p-10 text-center">

                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                  <p className="text-sm font-semibold text-slate-500">
                    {searchTerm
                      ? 'No medical submissions match your search.'
                      : 'No medical submissions found.'}
                  </p>

                </div>
              )}

            {/* =================================================
                REAL MEDICAL SUBMISSIONS
            ================================================== */}

            {!loading &&
              !error &&
              filteredSubmissions.map((submission) => {

                const initials = getInitials(
                  submission.studentName
                );

                const rawStatus =
                  submission.hodStatus ??
                  submission.approvalStatus ??
                  submission.status ??
                  'pending';

                const normalizedStatus = String(rawStatus)
                  .toLowerCase()
                  .replace(/[\s-]+/g, '_');

                const isPendingReview = normalizedStatus === 'pending';

                const statusConfig = normalizedStatus.includes('approved')
                  ? {
                      label: 'Approved',
                      className: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
                      Icon: CheckCircle2
                    }
                  : normalizedStatus.includes('rejected')
                    ? {
                        label: 'Rejected',
                        className: 'bg-rose-50 text-rose-600 border-rose-200/50',
                        Icon: ThumbsDown
                      }
                    : normalizedStatus.includes('forward')
                      ? {
                          label: 'Forwarded to Dean',
                          className: 'bg-blue-50 text-blue-600 border-blue-200/50',
                          Icon: CornerUpRight
                        }
                      : {
                          label: 'Requires HOD Approval',
                          className: 'bg-amber-50 text-amber-600 border-amber-200/50',
                          Icon: Clock
                        };

                const StatusIcon = statusConfig.Icon;

                const isProcessing =
                  actionLoading === submission.id;

                return (
                  <div
                    key={submission.id}
                    className="p-6 border-b border-slate-100 last:border-b-0"
                  >

                    <div className="grid grid-cols-12 gap-6">

                      {/* =====================================
                          LEFT COLUMN
                      ====================================== */}

                      <div className="col-span-4 space-y-4">

                        {/* Student */}

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-[#051E3D] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {initials}
                          </div>

                          <div>

                            <h4 className="font-bold text-slate-900 text-base leading-tight">
                              {submission.studentName ||
                                'Unknown Student'}
                            </h4>

                            <span className="text-xs text-slate-400 font-mono">
                              {submission.studentId || '-'}
                            </span>

                          </div>

                        </div>

                        {/* Details */}

                        <div className="space-y-1.5 text-xs">

                          {/* Course Code */}

                          <div className="flex justify-between py-1 border-b border-slate-100 gap-3">

                            <span className="text-slate-400 font-medium">
                              Course Code:
                            </span>

                            <span className="font-bold text-slate-800 text-right">
                              {submission.courseCode || '-'}
                            </span>

                          </div>

                          {/* Course Name */}

                          <div className="flex justify-between py-1 border-b border-slate-100 gap-3">

                            <span className="text-slate-400 font-medium">
                              Course:
                            </span>

                            <span className="font-semibold text-slate-700 text-right">
                              {submission.courseName || '-'}
                            </span>

                          </div>

                          {/* Description */}

                          <div className="flex justify-between py-1 border-b border-slate-100 gap-3">

                            <span className="text-slate-400 font-medium">
                              Description:
                            </span>

                            <span className="font-semibold text-slate-700 text-right">
                              {submission.description ||
                                'No description'}
                            </span>

                          </div>

                          {/* Dates */}

                          <div className="flex justify-between py-1 border-b border-slate-100 gap-3">

                            <span className="text-slate-400 font-medium">
                              Dates:
                            </span>

                            <span className="font-bold text-slate-800 text-right">
                              {formatDate(
                                submission.dateFrom
                              )}
                              {' - '}
                              {formatDate(
                                submission.dateTo
                              )}
                            </span>

                          </div>

                          {/* Submitted */}

                          <div className="flex justify-between py-1 border-b border-slate-100 gap-3">

                            <span className="text-slate-400 font-medium">
                              Submitted:
                            </span>

                            <span className="font-semibold text-slate-700 text-right">
                              {formatDate(
                                submission.submittedAt
                              )}
                            </span>

                          </div>

                        </div>

                        {/* Status */}

                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-md border ${statusConfig.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>

                      </div>

                      {/* =====================================
                          MIDDLE COLUMN
                      ====================================== */}

                      <div className="col-span-4 flex flex-col justify-between">

                        {/* Lecturer Review */}

                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 relative">

                          <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2">

                            <FileText className="w-3.5 h-3.5 text-indigo-600" />

                            Lecturer Review

                          </div>

                          <p className="text-xs text-indigo-900 font-semibold mb-2">

                            {submission.lecturer ||
                              'Lecturer not assigned'}

                          </p>

                          {/* Course */}

                          <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80 mb-2">

                            <p className="text-[10px] text-slate-400 font-medium">
                              Course
                            </p>

                            <p className="text-xs text-slate-700 font-semibold">
                              {submission.courseCode || '-'}
                              {submission.courseName
                                ? ` - ${submission.courseName}`
                                : ''}
                            </p>

                          </div>

                          {/* Description / Review */}

                          <div className="bg-white p-3 rounded-lg border border-indigo-100/80 shadow-xs text-xs text-slate-600 italic">

                            {submission.description ||
                              'No lecturer review note available.'}

                          </div>

                        </div>

                        {/* Actions */}

                        {isPendingReview && (
                          <div className="flex items-center gap-2 mt-4">

                            {/* Approve */}

                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(
                                  submission.id
                                )
                              }
                              disabled={isProcessing}
                              className="flex-1 bg-[#051E3D] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              <ThumbsUp className="w-3.5 h-3.5" />

                              {isProcessing
                                ? 'Processing...'
                                : 'Approve'}

                            </button>

                            {/* Reject */}

                            <button
                              type="button"
                              onClick={() =>
                                handleReject(
                                  submission.id
                                )
                              }
                              disabled={isProcessing}
                              className="border border-rose-300 text-rose-600 hover:bg-rose-50 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              <ThumbsDown className="w-3.5 h-3.5" />

                              Reject

                            </button>

                          </div>
                        )}

                      </div>

                      {/* =====================================
                          RIGHT COLUMN - DOCUMENT PREVIEW
                      ====================================== */}

                      <div className="col-span-4">

                        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-800 group h-56 flex flex-col justify-end shadow-xs">

                          {/* Document Preview */}

                          <div className="absolute inset-0 bg-slate-100 p-4 opacity-95 group-hover:opacity-100 transition-opacity">

                            <div className="h-full w-full bg-white border border-slate-300 p-3 shadow-inner rounded flex flex-col justify-between">

                              {/* Document Header */}

                              <div className="text-center border-b pb-1">

                                <p className="text-[9px] font-bold text-slate-700">
                                  MEDICAL CERTIFICATE
                                </p>

                                <p className="text-[7px] text-slate-400">
                                  SUBMISSION DOCUMENT
                                </p>

                              </div>

                              {/* Document Information */}

                              <div className="space-y-1 text-[8px] text-slate-600 my-auto">

                                <p>
                                  <strong>
                                    Student:
                                  </strong>{' '}
                                  {submission.studentName ||
                                    '-'}
                                </p>

                                <p>
                                  <strong>
                                    Student ID:
                                  </strong>{' '}
                                  {submission.studentId ||
                                    '-'}
                                </p>

                                <p>
                                  <strong>
                                    Course:
                                  </strong>{' '}
                                  {submission.courseCode ||
                                    '-'}
                                </p>

                                <p>
                                  <strong>
                                    Lecturer:
                                  </strong>{' '}
                                  {submission.lecturer ||
                                    '-'}
                                </p>

                                <p>
                                  <strong>
                                    Period:
                                  </strong>{' '}
                                  {formatDate(
                                    submission.dateFrom
                                  )}
                                  {' - '}
                                  {formatDate(
                                    submission.dateTo
                                  )}
                                </p>

                                <p>
                                  <strong>
                                    Description:
                                  </strong>{' '}
                                  {submission.description ||
                                    '-'}
                                </p>

                              </div>

                              {/* Document Footer */}

                              <div className="text-right border-t pt-1">

                                <p className="text-[8px] font-bold text-slate-800">
                                  Medical Document
                                </p>

                                <p className="text-[6px] text-slate-400">
                                  Submitted for HOD review
                                </p>

                              </div>

                            </div>

                          </div>

                          {/* Zoom Overlay */}

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/20 transition-opacity cursor-pointer">

                            <div className="p-2 bg-slate-900/80 text-white rounded-full shadow-lg">

                              <ZoomIn className="w-5 h-5" />

                            </div>

                          </div>

                          {/* File Name */}

                          <div className="relative z-10 bg-slate-900/90 text-white px-3 py-1.5 text-[11px] font-mono flex items-center gap-2 truncate">

                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                            <span className="truncate">

                              {submission.filePath ||
                                'Medical certificate'}

                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

          </div>

        </main>

      </div>

    </div>
  );
}