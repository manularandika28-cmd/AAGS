import React, { useEffect, useState } from "react";
import Sidenavbar from "../../components/Sidenavbar";
import Topnavbar from "../../components/Topnavbar";
import { useAuth } from '../../context/AuthContext';

import {
  UserRoundCheck,
  ClipboardList,
  CalendarDays,
  BriefcaseMedical,
  FileText,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const LecturerDashboard = () => {
  const { user, accessToken } = useAuth();

  const [lecturer, setLecturer] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
  const fetchLecturerDashboard = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/lecturer/dashboard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch dashboard");
      }
      const meetingsResponse = await fetch(
    "http://localhost:3000/api/lecturer/meetings",
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }
);
const sessionsResponse = await fetch(
    "http://localhost:3000/api/lecturer/sessions",
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }
);

const sessionsData = await sessionsResponse.json();

if (!sessionsResponse.ok) {
    throw new Error(sessionsData.error || "Failed to fetch sessions");
}
let totalEnrolled = 0;
let totalPresent = 0;

for (const session of sessionsData.sessions) {
    const attendanceResponse = await fetch(
        `http://localhost:3000/api/lecturer/sessions/${session.session_id}/attendance`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const attendanceData = await attendanceResponse.json();

    if (attendanceResponse.ok) {
        totalEnrolled += Number(attendanceData.enrolled_count || 0);

        totalPresent += attendanceData.attendance.filter(
            (record) => record.status === "present"
        ).length;
    }
}

const percentage =
    totalEnrolled > 0
        ? (totalPresent / totalEnrolled) * 100
        : 0;

setAttendancePercentage(percentage);

const meetingsData = await meetingsResponse.json();

if (!meetingsResponse.ok) {
    throw new Error(meetingsData.error || "Failed to fetch meetings");
}


setMeetings(meetingsData.meetings);
setSessions(sessionsData.sessions);
      console.log("Lecturer dashboard data:", data);
      setLecturer(data.lecturer);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  fetchLecturerDashboard();
}, [accessToken]);
const todaysMeetings = meetings.filter((meeting) => {
  if (meeting.status !== "confirmed" || !meeting.confirmed_date) {
    return false;
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });
    return meeting.confirmed_date.slice(0, 10) === today;
});
const pendingMeetings = meetings.filter(
  (meeting) => meeting.status === "pending"
);
const upcomingMeetings = meetings.filter((meeting) => {
  if (meeting.status !== "confirmed" || !meeting.confirmed_date) {
    return false;
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  return meeting.confirmed_date.slice(0, 10) > today;
});
const currentWeekStart = new Date();
currentWeekStart.setHours(0, 0, 0, 0);

const day = currentWeekStart.getDay();
const diff = day === 0 ? -6 : 1 - day;

currentWeekStart.setDate(currentWeekStart.getDate() + diff);
currentWeekStart.setDate(
  currentWeekStart.getDate() + weekOffset * 7
);

const weekDates = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(currentWeekStart);
  date.setDate(currentWeekStart.getDate() + index);
  return date;
});
  return (
    <div className="flex min-h-screen">

      {/* ================= SIDEBAR ================= */}
      <Sidenavbar />

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ================= TOP NAVBAR ================= */}
        <Topnavbar />

        {/* ================= DASHBOARD CONTENT ================= */}
        <main className="p-8 w-full max-w-[1200px] mx-auto space-y-7">

          {/* ================= PAGE TITLE ================= */}
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Overview
            </h1>

            <p className="text-[15px] text-white/80 mt-2">
              Welcome back, {lecturer?.name || user.name}. Here is your daily digest.
            </p>
          </div>


          {/* ================= SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* -------- Attendance Card -------- */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm min-h-[140px]">

              <div className="flex items-start justify-between">

                <span className="text-[11px] font-bold tracking-wider text-slate-600">
                  AVG STUDENT ATTENDANCE
                </span>

                <div className="w-9 h-9 rounded-lg bg-[#00427C] text-white flex items-center justify-center">
                  <UserRoundCheck className="w-5 h-5" />
                </div>

              </div>

              <div className="flex items-baseline gap-3 mt-7">

                <span className="text-4xl font-bold text-[#06264A]">
                  {attendancePercentage.toFixed(1)}%
                </span>

                <span className="text-xs font-medium text-green-600">
                  Current average
                </span>

              </div>

            </div>


            {/* -------- Upcoming Sessions Card -------- */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm min-h-[140px]">

              <div className="flex items-start justify-between">

                <span className="text-[11px] font-bold tracking-wider text-slate-600">
                  UPCOMING SESSIONS
                </span>

                <div className="w-9 h-9 rounded-lg bg-[#FF5B4F] text-white flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>

              </div>

              <div className="flex items-baseline gap-3 mt-7">

                <span className="text-4xl font-bold text-[#06264A]">
                  {sessions.filter((session) => {
                    const today = new Date().toLocaleDateString("en-CA", {
                      timeZone: "Asia/Colombo",
                    });

                    return session.session_date >= today;
                  }).length}
                </span>

                <span className="text-xs font-medium text-red-600">
                  Scheduled sessions
                </span>

              </div>

            </div>


            {/* -------- Meetings Card -------- */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm min-h-[140px]">

              <div className="flex items-start justify-between">

                <span className="text-[11px] font-bold tracking-wider text-slate-600">
                  MEETINGS TODAY
                </span>

                <div className="w-9 h-9 rounded-lg bg-[#713100] text-white flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>

              </div>

              <div className="flex items-baseline gap-3 mt-7">

                <span className="text-4xl font-bold text-[#06264A]">
                  {meetings.filter((meeting) => {
                              if (meeting.status !== "confirmed" || !meeting.confirmed_date) {
                                  return false;
                              }

                              const today = new Date().toLocaleDateString("en-CA", {
                                  timeZone: "Asia/Colombo",
                              });

                              return meeting.confirmed_date.slice(0, 10) === today;
                          }).length}
                </span>

                
                  <span className="text-xs text-slate-600">
                  {todaysMeetings.length > 0
                    ? `Next at ${new Date(
                        `1970-01-01T${todaysMeetings[0].confirmed_time}`
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}`
                    : "No meetings today"}
                </span>
                

              </div>

            </div>

          </div>


          {/* ================= LOWER CONTENT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* =====================================================
                ACTION ITEMS
            ====================================================== */}
            <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">

                <h2 className="text-xl font-bold text-[#06264A]">
                  Action Items
                </h2>

                         </div>


              {/* Items */}
              <div className="p-4 space-y-3">

                {/* Pending Meeting Requests */}
                <div className="flex items-center gap-4 border border-slate-200 rounded-lg p-4">

                  <div className="w-10 h-10 rounded-full bg-[#FFD9D5] text-red-600 flex items-center justify-center shrink-0">
                    <BriefcaseMedical className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Pending Meeting Requests
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      {pendingMeetings.length} meeting request
                      {pendingMeetings.length !== 1 ? "s" : ""} awaiting your response
                    </p>
                  </div>

                </div>


                {/* Attendance Review */}
                <div className="flex items-center gap-4 border border-slate-200 rounded-lg p-4">

                  <div className="w-10 h-10 rounded-full bg-[#DCE9FF] text-[#174A88] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Attendance Review
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      Review attendance records for your scheduled sessions
                    </p>
                  </div>

                </div>


                {/* Upcoming Meetings */}
                <div className="flex items-center gap-4 border border-slate-200 rounded-lg p-4">

                  <div className="w-10 h-10 rounded-full bg-[#FFDFCC] text-[#8A3C12] flex items-center justify-center shrink-0">
                    <Clock3 className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Upcoming Meetings
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      {upcomingMeetings.length} upcoming meeting
                      {upcomingMeetings.length !== 1 ? "s" : ""} scheduled
                    </p>
                  </div>

                </div>

              </div>

            </section>


            {/* =====================================================
                SCHEDULE
            ====================================================== */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-h-[500px]">

              {/* Schedule Header */}
              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold text-[#06264A]">
                  Schedule
                </h2>

                <div className="flex items-center gap-3">

                  <button
                      onClick={() => setWeekOffset((prev) => prev - 1)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button 
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="text-slate-600 hover:text-slate-900">
                    <ChevronRight className="w-5 h-5" />
                  </button>

                </div>

              </div>


              {/* Calendar */}
              <div className="mt-6">

                {/* Weekdays */}
                {weekDates.map((date) => {
                  const dateString = date.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Colombo",
                  });

                  const today = new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Colombo",
                  });

                  const hasMeeting = meetings.some(
                    (meeting) =>
                      meeting.status === "confirmed" &&
                      meeting.confirmed_date &&
                      meeting.confirmed_date.slice(0, 10) === dateString
                  );

                  const isToday = dateString === today;

                  return (
                    <span
                      key={dateString}
                      className={`relative text-xs p-2 ${
                        isToday
                          ? "w-8 h-8 mx-auto rounded-full bg-[#06264A] text-white flex items-center justify-center"
                          : "text-slate-700"
                      }`}
                    >
                      {date.getDate()}

                      {hasMeeting && (
                        <span
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                            isToday ? "bg-red-600" : "bg-[#06264A]"
                          }`}
                        ></span>
                      )}
                    </span>
                  );
                })}

                  

                

              </div>


              {/* Today's Agenda */}
              <div className="border-t border-slate-200 mt-5 pt-4">

                <h3 className="text-[11px] font-bold text-slate-600 mb-4">
                  TODAY'S AGENDA
                </h3>


                
                <div className="grid grid-cols-[48px_1fr] gap-3 mb-4">
                {todaysMeetings.length === 0 ? (
                    <div className="text-sm text-slate-500 py-4">
                      No meetings scheduled for today.
                    </div>
                  ) : (
                    todaysMeetings
                      .slice()
                      .sort((a, b) =>
                        a.confirmed_time.localeCompare(b.confirmed_time)
                      )
                      .map((meeting) => {
                        const time = new Date(
                          `1970-01-01T${meeting.confirmed_time}`
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        });

                        const [hour, minute] = time.split(":");
                        const amPm = time.slice(-2);
                        const displayTime = `${hour}:${minute}`;

                        return (
                          <div
                            key={meeting.request_id}
                            className="grid grid-cols-[48px_1fr] gap-3 mb-4"
                          >
                            <div>
                              <strong className="block text-sm text-[#06264A]">
                                {displayTime}
                              </strong>

                              <span className="text-[11px] text-slate-500">
                                {amPm}
                              </span>
                            </div>

                            <div className="bg-[#EDF3FF] border-l-4 border-[#06264A] rounded-r-md p-3">
                              <strong className="block text-sm text-slate-800">
                                {meeting.student_name}
                              </strong>

                              <span className="text-xs text-slate-600">
                                {meeting.purpose || "Meeting"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                  
                </div>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
};

export default LecturerDashboard;