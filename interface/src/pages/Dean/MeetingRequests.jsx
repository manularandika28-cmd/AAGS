import React, { useEffect, useState } from 'react';
import {
    CalendarDays,
    Clock,
    User,
    Check,
    X,
    RefreshCw,
    MessageSquare,
    AlertCircle
} from 'lucide-react';

import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:3000/api/dean';

export default function DeanMeetingRequests() {

    const { accessToken, refreshAccessToken } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending');

    // =========================================================
    // FETCH MEETING REQUESTS
    // =========================================================

    const fetchMeetingRequests = async (retry = true) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${API_BASE}/meeting-requests?status=${filter}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // -------------------------------------------------
            // TOKEN EXPIRED
            // -------------------------------------------------

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                if (retry) {
                    const newToken =
                        await refreshAccessToken();

                    if (newToken) {
                        return fetchMeetingRequests(false);
                    }
                }

                throw new Error(
                    'Your session has expired. Please log in again.'
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    'Failed to load meeting requests'
                );
            }

            setRequests(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                'Dean meeting requests error:',
                err
            );

            setError(
                err.message ||
                'Failed to load meeting requests'
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOAD WHEN PAGE / FILTER / TOKEN CHANGES
    // =========================================================

    useEffect(() => {

        if (accessToken) {
            fetchMeetingRequests();
        }

    }, [accessToken, filter]);

    // =========================================================
    // UPDATE REQUEST STATUS
    //
    // IMPORTANT:
    // Database enum:
    // pending
    // accepted
    // rejected
    // cancelled
    // completed
    // =========================================================

    const updateRequestStatus = async (
        requestId,
        status
    ) => {

        const actionText =
            status === 'accepted'
                ? 'accept'
                : 'reject';

        const confirmed = window.confirm(
            `Are you sure you want to ${actionText} this meeting request?`
        );

        if (!confirmed) {
            return;
        }

        setProcessingId(requestId);
        setError('');

        try {

            const response = await fetch(
                `${API_BASE}/meeting-requests/${requestId}/${status}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            // -------------------------------------------------
            // TOKEN EXPIRED
            // -------------------------------------------------

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                const newToken =
                    await refreshAccessToken();

                if (newToken) {

                    const retryResponse =
                        await fetch(
                            `${API_BASE}/meeting-requests/${requestId}/${status}`,
                            {
                                method: 'PATCH',

                                headers: {
                                    'Content-Type':
                                        'application/json',

                                    Authorization:
                                        `Bearer ${newToken}`,
                                },
                            }
                        );

                    const retryData =
                        await retryResponse.json();

                    if (!retryResponse.ok) {

                        throw new Error(
                            retryData.error ||
                            `Failed to ${actionText} meeting request`
                        );
                    }

                    await fetchMeetingRequests(false);

                    return;
                }

                throw new Error(
                    'Your session has expired. Please log in again.'
                );
            }

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `Failed to ${actionText} meeting request`
                );
            }

            await fetchMeetingRequests(false);

        } catch (err) {

            console.error(
                `Dean meeting request ${status} error:`,
                err
            );

            setError(
                err.message ||
                `Failed to ${actionText} meeting request`
            );

        } finally {

            setProcessingId(null);
        }
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    };

    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (time) => {

        if (!time) {
            return '-';
        }

        const [hours, minutes] =
            time.split(':');

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        );
    };

    // =========================================================
    // GET REQUESTER ROLE
    // =========================================================

    const getRequesterRole = (request) => {

        if (
            request.requester_role === 'HOD' ||
            request.role === 'HOD'
        ) {
            return 'HOD';
        }

        return 'Lecturer';
    };

    // =========================================================
    // GET REQUESTER NAME
    // =========================================================

    const getRequesterName = (request) => {

        return (
            request.requester_name ||
            request.name ||
            request.lecturer_name ||
            request.hod_name ||
            'Unknown User'
        );
    };

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusStyle = (status) => {

        switch (
            String(status).toLowerCase()
        ) {

            case 'accepted':
                return 'bg-emerald-100 text-emerald-700';

            case 'rejected':
            case 'cancelled':
                return 'bg-red-100 text-red-700';

            case 'completed':
                return 'bg-blue-100 text-blue-700';

            case 'pending':
            default:
                return 'bg-amber-100 text-amber-700';
        }
    };

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="flex min-h-screen">

            <Sidenavbar
                activeItem="meeting-requests"
                role="Dean"
            />

            <div className="flex-1 flex flex-col">

                <Topnavbar
                    title="Dean Meeting Requests - AAGS"
                    searchPlaceholder="Search requests..."
                    userName="Prof. N. Perera"
                    userRole="Dean, FOT"
                />

                <main className="flex-1 p-8">

                    {/* =========================================
                        HEADER
                    ========================================= */}

                    <div className="flex items-start justify-between mb-6">

                        <div>

                            <h1 className="text-2xl font-bold text-white">
                                Meeting Requests
                            </h1>

                            <p className="text-sm text-white/70 mt-1">
                                Review meeting requests submitted
                                by Lecturers and Heads of Department.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                fetchMeetingRequests()
                            }
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#071B38] hover:bg-[#0a2549] disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? 'animate-spin'
                                        : ''
                                }
                            />

                            Refresh

                        </button>

                    </div>

                    <hr className="border-slate-200 mb-6" />

                    {/* =========================================
                        POLICY
                    ========================================= */}

                    <div className="mb-6 rounded-xl border border-blue-300/30 bg-blue-500/10 backdrop-blur-xl p-4">

                        <div className="flex items-start gap-3">

                            <AlertCircle
                                size={19}
                                className="text-blue-300 mt-0.5 shrink-0"
                            />

                            <div>

                                <p className="text-sm font-semibold text-white">
                                    Dean Meeting Policy
                                </p>

                                <p className="text-xs text-white/70 mt-1">
                                    Only Lecturers and Heads of
                                    Department can submit meeting
                                    requests to the Dean. Student
                                    meeting requests are not displayed
                                    or processed on this page.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =========================================
                        FILTER
                    ========================================= */}

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter('pending')
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === 'pending'
                                        ? 'bg-white text-[#071B38]'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                Pending
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter('all')
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === 'all'
                                        ? 'bg-white text-[#071B38]'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                All Requests
                            </button>

                        </div>

                        <div className="text-sm text-white/70">

                            {requests.length}{' '}

                            {requests.length === 1
                                ? 'request'
                                : 'requests'}

                        </div>

                    </div>

                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {error && (

                        <div className="mb-5 rounded-xl border border-red-300/30 bg-red-500/10 p-4">

                            <div className="flex items-center gap-3">

                                <AlertCircle
                                    size={18}
                                    className="text-red-300"
                                />

                                <p className="text-sm text-red-200">
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}

                    {/* =========================================
                        LOADING
                    ========================================= */}

                    {loading && (

                        <div className="rounded-2xl bg-white/10 border border-white/20 p-12 text-center">

                            <RefreshCw
                                size={30}
                                className="animate-spin text-white mx-auto mb-3"
                            />

                            <p className="text-sm text-white/70">
                                Loading meeting requests...
                            </p>

                        </div>

                    )}

                    {/* =========================================
                        EMPTY
                    ========================================= */}

                    {!loading &&
                        requests.length === 0 && (

                            <div className="rounded-2xl bg-white/10 border border-white/20 p-12 text-center">

                                <CalendarDays
                                    size={42}
                                    className="text-white/50 mx-auto mb-4"
                                />

                                <h2 className="text-lg font-semibold text-white">
                                    No meeting requests
                                </h2>

                                <p className="text-sm text-white/60 mt-2">
                                    There are currently no meeting
                                    requests matching this filter.
                                </p>

                            </div>

                        )}

                    {/* =========================================
                        REQUEST LIST
                    ========================================= */}

                    {!loading &&
                        requests.length > 0 && (

                            <div className="space-y-4">

                                {requests.map((request) => {

                                    const requesterRole =
                                        getRequesterRole(
                                            request
                                        );

                                    const requesterName =
                                        getRequesterName(
                                            request
                                        );

                                    const status =
                                        String(
                                            request.status ||
                                            'pending'
                                        ).toLowerCase();

                                    const isPending =
                                        status === 'pending';

                                    return (

                                        <div
                                            key={
                                                request.request_id
                                            }
                                            className="rounded-2xl p-5 shadow-xl backdrop-blur-2xl border border-white/30 bg-white/10"
                                        >

                                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">

                                                {/* REQUESTER */}

                                                <div className="flex items-start gap-4">

                                                    <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">

                                                        <User
                                                            size={19}
                                                            className="text-white"
                                                        />

                                                    </div>

                                                    <div>

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h2 className="text-base font-semibold text-white">

                                                                {
                                                                    requesterName
                                                                }

                                                            </h2>

                                                            <span className="px-2 py-0.5 rounded-full bg-blue-400/15 text-blue-200 text-xs font-medium">

                                                                {
                                                                    requesterRole
                                                                }

                                                            </span>

                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(status)}`}
                                                            >

                                                                {status
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase() +
                                                                    status.slice(
                                                                        1
                                                                    )}

                                                            </span>

                                                        </div>

                                                        {requesterRole ===
                                                            'Lecturer' &&
                                                            request.lecturer_email && (

                                                                <p className="text-xs text-white/60 mt-1">

                                                                    {
                                                                        request.lecturer_email
                                                                    }

                                                                </p>

                                                            )}

                                                        {requesterRole ===
                                                            'HOD' &&
                                                            request.hod_email && (

                                                                <p className="text-xs text-white/60 mt-1">

                                                                    {
                                                                        request.hod_email
                                                                    }

                                                                </p>

                                                            )}

                                                    </div>

                                                </div>

                                                {/* =================================
                                                    ACTION BUTTONS
                                                ================================= */}

                                                {isPending && (

                                                    <div className="flex items-center gap-2">

                                                        {/* ACCEPT */}

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                processingId ===
                                                                request.request_id
                                                            }
                                                            onClick={() =>
                                                                updateRequestStatus(
                                                                    request.request_id,
                                                                    'accepted'
                                                                )
                                                            }
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                                                        >

                                                            <Check
                                                                size={16}
                                                            />

                                                            Approve

                                                        </button>

                                                        {/* REJECT */}

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                processingId ===
                                                                request.request_id
                                                            }
                                                            onClick={() =>
                                                                updateRequestStatus(
                                                                    request.request_id,
                                                                    'rejected'
                                                                )
                                                            }
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                                                        >

                                                            <X
                                                                size={16}
                                                            />

                                                            Reject

                                                        </button>

                                                    </div>

                                                )}

                                            </div>

                                            {/* =================================
                                                DETAILS
                                            ================================= */}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/15">

                                                {/* DATE */}

                                                <div className="flex items-center gap-3">

                                                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">

                                                        <CalendarDays
                                                            size={17}
                                                            className="text-white/80"
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="text-xs text-white/50">
                                                            Preferred Date
                                                        </p>

                                                        <p className="text-sm text-white font-medium mt-0.5">

                                                            {
                                                                formatDate(
                                                                    request.preferred_date
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* TIME */}

                                                <div className="flex items-center gap-3">

                                                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">

                                                        <Clock
                                                            size={17}
                                                            className="text-white/80"
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="text-xs text-white/50">
                                                            Preferred Time
                                                        </p>

                                                        <p className="text-sm text-white font-medium mt-0.5">

                                                            {
                                                                formatTime(
                                                                    request.preferred_time
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* REQUEST ID */}

                                                <div className="flex items-center gap-3">

                                                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">

                                                        <MessageSquare
                                                            size={17}
                                                            className="text-white/80"
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="text-xs text-white/50">
                                                            Request ID
                                                        </p>

                                                        <p className="text-sm text-white font-medium mt-0.5">

                                                            #
                                                            {
                                                                request.request_id
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* =================================
                                                PURPOSE
                                            ================================= */}

                                            <div className="mt-5">

                                                <p className="text-xs text-white/50 mb-1">
                                                    Purpose
                                                </p>

                                                <p className="text-sm text-white/90 leading-relaxed">

                                                    {
                                                        request.purpose ||
                                                        'No purpose provided.'
                                                    }

                                                </p>

                                            </div>

                                            {/* =================================
                                                RESPONSE
                                            ================================= */}

                                            {request.response && (

                                                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">

                                                    <p className="text-xs text-white/50 mb-1">
                                                        Response
                                                    </p>

                                                    <p className="text-sm text-white/80">

                                                        {
                                                            request.response
                                                        }

                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                </main>

            </div>

        </div>

    );
}