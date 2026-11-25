
import React, { useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

import {
    Search,
    Clock,
    CheckCircle2,
    FileText,
    ThumbsUp,
    ThumbsDown,
    Eye
} from 'lucide-react';

const MoDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Temporary data until the Medical Officer API is connected.
    const [submissions, setSubmissions] = useState([]);

    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const filteredSubmissions = submissions.filter((item) => {
        const matchesStatus =
            statusFilter === 'all' || item.status === statusFilter;

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            item.studentName.toLowerCase().includes(search) ||
            item.studentId.toLowerCase().includes(search);

        return matchesStatus && matchesSearch;
    });

    const handleReview = (id, status) => {
        setSubmissions((previous) =>
            previous.map((item) =>
                item.id === id ? { ...item, status } : item
            )
        );

        setSelectedSubmission(null);
    };

    const pendingCount = submissions.filter(
        (item) => item.status === 'pending'
    ).length;

    const approvedCount = submissions.filter(
        (item) => item.status === 'approved'
    ).length;

    return (
        <div className="flex h-screen text-slate-800 font-sans antialiased overflow-hidden">

            <Sidenavbar />

            <div className="flex-1 flex flex-col overflow-y-auto">
            <Topnavbar />
                <main className="p-8 space-y-6 max-w-7xl w-full">

                    {/* HEADER */}

                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Medical Officer Dashboard
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Review and verify student medical certificates.
                        </p>
                    </div>

                    {/* STATISTICS */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500">
                                    Pending Reviews
                                </p>

                                <p className="text-2xl font-black text-slate-900">
                                    {pendingCount}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500">
                                    Approved
                                </p>

                                <p className="text-2xl font-black text-slate-900">
                                    {approvedCount}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500">
                                    Total Submissions
                                </p>

                                <p className="text-2xl font-black text-slate-900">
                                    {submissions.length}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* MEDICAL REVIEW QUEUE */}

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">

                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-700" />

                                <h3 className="font-bold text-slate-800 text-sm">
                                    Medical Verification Queue
                                </h3>
                            </div>

                            <div className="flex items-center gap-2">

                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

                                    <input
                                        type="text"
                                        placeholder="Search student..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 pr-3 py-2 w-48 border border-slate-200 rounded-md text-xs outline-none focus:ring-1 focus:ring-slate-300"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-slate-200 bg-white px-3 py-2 rounded-md text-xs font-semibold text-slate-600 outline-none"
                                >
                                    <option value="all">All statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                            </div>

                        </div>

                        {/* EMPTY STATE */}

                        {filteredSubmissions.length === 0 && (
                            <div className="p-12 text-center">

                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />

                                <p className="text-sm font-semibold text-slate-500">
                                    No medical submissions available.
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    New submissions awaiting verification will appear here.
                                </p>

                            </div>
                        )}

                        {/* SUBMISSIONS */}

                        {filteredSubmissions.map((submission) => (

                            <div
                                key={submission.id}
                                className="p-6 border-b border-slate-100 last:border-b-0"
                            >

                                <div className="flex flex-col lg:flex-row justify-between gap-5">

                                    <div className="space-y-2">

                                        <h4 className="font-bold text-slate-900">
                                            {submission.studentName}
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            Student ID: {submission.studentId}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Course: {submission.courseCode}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Medical Period: {submission.dateFrom} - {submission.dateTo}
                                        </p>

                                        <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-md bg-amber-50 text-amber-600">
                                            {submission.status}
                                        </span>

                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <button
                                            type="button"
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-50"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>

                                        {submission.status === 'pending' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReview(submission.id, 'approved')}
                                                    className="px-4 py-2 bg-[#051E3D] text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                    Approve
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleReview(submission.id, 'rejected')}
                                                    className="px-4 py-2 border border-rose-300 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-rose-50"
                                                >
                                                    <ThumbsDown className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </main>

            </div>

            {/* DETAILS MODAL */}

            {selectedSubmission && (
                <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900">
                                Medical Submission Details
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedSubmission(null)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600">
                            <p><strong>Student:</strong> {selectedSubmission.studentName}</p>
                            <p><strong>Student ID:</strong> {selectedSubmission.studentId}</p>
                            <p><strong>Course:</strong> {selectedSubmission.courseCode}</p>
                            <p><strong>Period:</strong> {selectedSubmission.dateFrom} - {selectedSubmission.dateTo}</p>
                            <p><strong>Description:</strong> {selectedSubmission.description}</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedSubmission(null)}
                                className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
                            >
                                Close
                            </button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default MoDashboard;
