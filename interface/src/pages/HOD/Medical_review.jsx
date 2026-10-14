import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CornerUpRight,
  ExternalLink,
  FileText,
  Filter,
  Loader2,
  Search,
  ThumbsDown,
  ThumbsUp,
  ZoomIn
} from 'lucide-react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import API from '../../lib/api';

const STATUS_LABELS = {
  pending: 'Requires HOD Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  forwarded_to_dean: 'Forwarded to Dean'
};

const QUEUE_TITLES = {
  pending: 'Pending Medicals',
  approved: 'Approved Medicals',
  rejected: 'Rejected Medicals',
  forwarded_to_dean: 'Forwarded to Dean',
  reviewed: 'Reviewed Medicals',
  all: 'All Medical Submissions'
};

const formatDate = (value) => {
  if (!value) return 'Not provided';
  const dateValue = String(value).slice(0, 10);
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateRange = (start, end) => {
  if (!start && !end) return 'Dates not provided';
  if (!end || start === end) return formatDate(start || end);
  return `${formatDate(start)} - ${formatDate(end)}`;
};

const getStatusLabel = (status) => STATUS_LABELS[String(status || '').toLowerCase()] || status || 'Unknown';

const getInitials = (name) => String(name || 'Student')
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

const getRequestErrorMessage = async (requestError, fallback) => {
  const responseData = requestError.response?.data;
  if (responseData instanceof Blob) {
    try {
      const body = JSON.parse(await responseData.text());
      return body.error || fallback;
    } catch {
      return fallback;
    }
  }

  return responseData?.error || fallback;
};

export default function MedicalReview() {
  const [medicals, setMedicals] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approvedThisMonth: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [documentPreview, setDocumentPreview] = useState(null);

  const loadMedicals = async () => {
    try {
      setError('');
      const response = await API.get('/hod/medicals');
      const records = response.data.medicals || [];
      setMedicals(records);
      setStats(response.data.stats || { pending: 0, approvedThisMonth: 0 });
      setExpandedId((currentId) => (
        records.some((record) => record.submission_id === currentId)
          ? currentId
          : records.find((record) => String(record.status).toLowerCase() === 'pending')?.submission_id
            ?? records[0]?.submission_id
            ?? null
      ));
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not load medical submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicals();
  }, []);

  const visibleMedicals = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return medicals.filter((medical) => {
      const status = String(medical.status || '').toLowerCase();
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'pending' && status === 'pending')
        || (statusFilter === 'approved' && status === 'approved')
        || (statusFilter === 'rejected' && status === 'rejected')
        || (statusFilter === 'forwarded_to_dean' && status === 'forwarded_to_dean')
        || (statusFilter === 'reviewed' && status !== 'pending');
      const matchesSearch = !search || [
        medical.student_name,
        medical.student_id,
        medical.description,
        medical.academic_level,
        medical.semester
      ].some((value) => String(value || '').toLowerCase().includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [medicals, searchTerm, statusFilter]);

  const expandedMedical = visibleMedicals.find((medical) => medical.submission_id === expandedId);

  useEffect(() => {
    if (visibleMedicals.length === 0) {
      setExpandedId(null);
      return;
    }

    if (!visibleMedicals.some((medical) => medical.submission_id === expandedId)) {
      setExpandedId(visibleMedicals[0].submission_id);
    }
  }, [visibleMedicals, expandedId]);

  useEffect(() => {
    if (!expandedMedical?.file_path) {
      setDocumentPreview(null);
      return undefined;
    }

    let active = true;
    let objectUrl;
    setDocumentPreview({ id: expandedMedical.submission_id, loading: true });

    API.get(`/hod/medicals/${expandedMedical.submission_id}/document`, { responseType: 'blob' })
      .then((response) => {
        const file = new Blob([response.data], {
          type: response.headers['content-type'] || response.data.type || 'application/octet-stream'
        });
        objectUrl = URL.createObjectURL(file);
        if (active) {
          setDocumentPreview({
            id: expandedMedical.submission_id,
            loading: false,
            url: objectUrl,
            type: file.type,
            filePath: expandedMedical.file_path
          });
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      })
      .catch(async (requestError) => {
        if (active) {
          const message = await getRequestErrorMessage(requestError, 'Certificate could not be loaded.');
          if (!active) return;
          setDocumentPreview({
            id: expandedMedical.submission_id,
            error: message
          });
        }
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [expandedMedical?.submission_id, expandedMedical?.file_path]);

  const updateStatus = async (medical, action) => {
    setBusyId(medical.submission_id);
    setError('');
    try {
      await API.patch(`/hod/medicals/${medical.submission_id}/${action}`);
      setExpandedId(null);
      await loadMedicals();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not update this submission.');
    } finally {
      setBusyId(null);
    }
  };

  const openPreviewInTab = () => {
    if (documentPreview?.url) window.open(documentPreview.url, '_blank', 'noopener,noreferrer');
  };

  const isImage = documentPreview?.type?.startsWith('image/');
  const isPdf = documentPreview?.type === 'application/pdf'
    || String(documentPreview?.filePath || '').toLowerCase().endsWith('.pdf');

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">
      <Sidenavbar />
      <div className="flex min-w-0 flex-1 flex-col min-h-screen">
        <Topnavbar />
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">HOD Medical Review</h1>
              <p className="mt-1 max-w-xl text-xs leading-5 text-white sm:text-sm">
                Review and process student medical certificates from your department.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 self-start lg:self-auto">
              <div className="flex min-w-32 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:min-w-40 sm:p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <Clock3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold leading-tight text-slate-600 sm:text-[11px]">Pending HOD Review</p>
                  <p className="text-2xl font-black leading-tight text-slate-900">{stats.pending}</p>
                </div>
              </div>
              <div className="flex min-w-32 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:min-w-40 sm:p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold leading-tight text-slate-600 sm:text-[11px]">Approved This Month</p>
                  <p className="text-2xl font-black leading-tight text-slate-900">{stats.approvedThisMonth}</p>
                </div>
              </div>
            </div>
          </header>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-800 sm:text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">{QUEUE_TITLES[statusFilter]}</h2>
                {!loading && <span className="text-xs text-slate-500">({visibleMedicals.length})</span>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search records..."
                    className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-slate-400 sm:w-48"
                  />
                </label>
                <div className="relative flex items-center">
                  <Filter className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-slate-500" />
                  <select
                    aria-label="Filter medical submissions"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-md border border-slate-200 bg-white py-1.5 pl-7 pr-2 text-xs font-semibold text-slate-700 outline-none focus:border-slate-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="forwarded_to_dean">Forwarded to Dean</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="all">All records</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                Loading medical submissions...
              </div>
            ) : visibleMedicals.length === 0 ? (
              <div className="flex min-h-60 flex-col items-center justify-center px-5 text-center">
                <FileText className="h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">No medical submissions found</p>
                <p className="mt-1 text-xs text-slate-500">
                  {searchTerm.trim()
                    ? 'Try another search term.'
                    : statusFilter === 'pending'
                      ? 'There are no pending reviews in your department.'
                      : `There are no ${statusFilter === 'all' ? '' : `${statusFilter.replaceAll('_', ' ')} `}medical submissions in your department.`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {visibleMedicals.map((medical) => {
                  const status = String(medical.status || '').toLowerCase();
                  const isPending = status === 'pending';
                  const isExpanded = expandedId === medical.submission_id;
                  const isBusy = busyId === medical.submission_id;

                  if (!isExpanded) {
                    return (
                      <button
                        key={medical.submission_id}
                        type="button"
                        onClick={() => setExpandedId(medical.submission_id)}
                        className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left transition-colors hover:bg-slate-50 sm:px-5"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{getInitials(medical.student_name)}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-bold text-slate-800 sm:text-sm">{medical.student_name || 'Student'}</span>
                            <span className="block font-mono text-[10px] text-slate-500">{medical.student_id}</span>
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="hidden text-xs text-slate-500 sm:inline">{formatDateRange(medical.date_from, medical.date_to)}</span>
                          <span className={`rounded px-2 py-1 text-[10px] font-bold ${isPending ? 'bg-amber-50 text-amber-700' : status === 'approved' ? 'bg-emerald-50 text-emerald-700' : status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                            {getStatusLabel(status)}
                          </span>
                        </span>
                      </button>
                    );
                  }

                  return (
                    <article key={medical.submission_id} className="p-4 sm:p-5">
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-4">
                        <div className="space-y-4 lg:col-span-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b315c] text-xs font-bold text-white shadow-sm">
                              {getInitials(medical.student_name)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold leading-tight text-slate-900">{medical.student_name || 'Student'}</h3>
                              <span className="font-mono text-[10px] text-slate-500">{medical.student_id}</span>
                            </div>
                          </div>
                          <dl className="space-y-2 text-[11px]">
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                              <dt className="shrink-0 text-slate-500">Programme:</dt>
                              <dd className="text-right font-semibold text-slate-700">{[medical.academic_level, medical.semester].filter(Boolean).join(' ') || 'Not provided'}</dd>
                            </div>
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                              <dt className="shrink-0 text-slate-500">Dates:</dt>
                              <dd className="text-right font-semibold text-slate-800">{formatDateRange(medical.date_from, medical.date_to)}</dd>
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <dt className="shrink-0 text-slate-500">Submitted:</dt>
                              <dd className="text-right font-semibold text-slate-700">{formatDate(medical.submitted_at)}</dd>
                            </div>
                          </dl>
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${isPending ? 'bg-amber-50 text-amber-700' : status === 'approved' ? 'bg-emerald-50 text-emerald-700' : status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                            {isPending ? <Clock3 className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {getStatusLabel(status)}
                          </span>
                        </div>

                        <div className="flex min-w-0 flex-col lg:col-span-4">
                          <div className="flex-1 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase text-indigo-900">
                              <FileText className="h-3.5 w-3.5 text-indigo-600" />
                              Student’s reason
                            </div>
                            <p className="text-xs font-medium leading-5 text-slate-700">
                              {medical.description || 'No additional details were provided with this submission.'}
                            </p>
                          </div>
                          {isPending ? (
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateStatus(medical, 'approve')}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#051E3D] px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                              >
                                {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => updateStatus(medical, 'reject')}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-rose-300 px-3 py-2 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => updateStatus(medical, 'forward')}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                              >
                                <CornerUpRight className="h-3.5 w-3.5" />
                                Forward to Dean
                              </button>
                            </div>
                          ) : (
                            <p className="mt-3 text-center text-[11px] text-slate-500">
                              Reviewed {formatDate(medical.reviewed_at)}
                            </p>
                          )}
                        </div>

                        <div className="min-w-0 lg:col-span-5">
                          <div className="group relative h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-56">
                            {documentPreview?.id === medical.submission_id && documentPreview.loading ? (
                              <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading certificate...
                              </div>
                            ) : documentPreview?.id === medical.submission_id && documentPreview.error ? (
                              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-xs text-rose-700">
                                <AlertCircle className="h-5 w-5" />
                                {documentPreview.error}
                              </div>
                            ) : documentPreview?.id === medical.submission_id && documentPreview.url && isImage ? (
                              <img src={documentPreview.url} alt={`Medical certificate for ${medical.student_name || 'student'}`} className="h-full w-full object-contain" />
                            ) : documentPreview?.id === medical.submission_id && documentPreview.url && isPdf ? (
                              <iframe title={`Medical certificate for ${medical.student_name || 'student'}`} src={documentPreview.url} className="h-full w-full border-0 bg-white" />
                            ) : documentPreview?.id === medical.submission_id && documentPreview.url ? (
                              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                                <FileText className="h-9 w-9 text-slate-400" />
                                <p className="text-xs text-slate-600">Preview is unavailable for this file type.</p>
                                <button type="button" onClick={openPreviewInTab} className="text-xs font-bold text-blue-800 underline">Open document</button>
                              </div>
                            ) : medical.file_path ? (
                              <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading certificate...
                              </div>
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                                <FileText className="h-8 w-8 text-slate-300" />
                                No certificate attached
                              </div>
                            )}
                            {documentPreview?.id === medical.submission_id && documentPreview.url && (
                              <button
                                type="button"
                                onClick={openPreviewInTab}
                                title="Open certificate in a new tab"
                                className="absolute right-2 top-2 rounded bg-slate-900/75 p-2 text-white opacity-0 transition-opacity hover:bg-slate-900 group-hover:opacity-100 focus:opacity-100"
                              >
                                <ZoomIn className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2 rounded bg-slate-800 px-3 py-2 text-[10px] text-white">
                            <span className="flex min-w-0 items-center gap-2 truncate font-mono">
                              <FileText className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                              <span className="truncate">{medical.file_path ? medical.file_path.split(/[\\/]/).pop() : 'Certificate unavailable'}</span>
                            </span>
                            {documentPreview?.id === medical.submission_id && documentPreview.url && (
                              <button type="button" onClick={openPreviewInTab} className="shrink-0 text-slate-200 hover:text-white" aria-label="Open certificate in new tab">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}