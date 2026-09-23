import React, { useEffect, useState } from 'react';
import Sidenavbar from "../../components/Sidenavbar";
import Topnavbar from "../../components/Topnavbar";
import { useAuth } from '../../context/AuthContext';

import {
  LayoutDashboard,
  CalendarDays,
  BriefcaseMedical,
  GraduationCap,
  Landmark,
  LogOut,
  Bell,
  CircleHelp,
  UserRound,
  Plus,
  ClipboardList,
  CalendarCheck,
  FlaskConical,
  Inbox,
  SlidersHorizontal,
  ListFilter,
  Clock3,
  MapPin,
  Check,
  X,
  CalendarClock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const MeetingManagement = () => {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const { accessToken, user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const confirmedMeetings = meetings.filter(
  (meeting) => meeting.status === "confirmed"
);
const today = new Date();
const dayOfWeek = today.getDay();

const daysFromMonday = dayOfWeek === 0
  ? 6
  : dayOfWeek - 1;

const scheduleStartDate = new Date(today);

scheduleStartDate.setDate(
  today.getDate() - daysFromMonday + weekOffset * 7
);

const scheduleEndDate = new Date(scheduleStartDate);
scheduleEndDate.setDate(scheduleStartDate.getDate() + 6);

const scheduleDateRange = `${scheduleStartDate.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
})} - ${scheduleEndDate.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
})}`;
const scheduleDates = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(scheduleStartDate);
  date.setDate(scheduleStartDate.getDate() + index);
  return date;
});


const todaysMeetings = confirmedMeetings.filter((meeting) => {
  if (!meeting.confirmed_date) return false;

  const meetingDate = new Date(meeting.confirmed_date);

  return (
    meetingDate.getFullYear() === today.getFullYear() &&
    meetingDate.getMonth() === today.getMonth() &&
    meetingDate.getDate() === today.getDate()
  );
});

useEffect(() => {
    const fetchMeetings = async () => {
        try {
            const response = await fetch(
                'http://localhost:3000/api/lecturer/meetings',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setMeetings(data.meetings);
            console.log("Lecturer meetings:", data.meetings);
        } catch (error) {
            console.error('Failed to fetch meetings:', error);
        }
    };

    if (accessToken) {
        fetchMeetings();
    }
}, [accessToken]);
  return (
    <div className="min-h-screen flex text-[#071B38]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <Sidenavbar />


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="flex-1 min-w-0">


        {/* ===================================================
            PAGE BODY
        ==================================================== */}
        <main className="p-6 lg:p-7">

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">


            {/* =================================================
                LEFT CONTENT
            ================================================== */}
            <div className="min-w-0">


              {/* Page title */}
              <div className="flex items-end justify-between mb-6">

                <div>

                  <h2 className="text-[38px] leading-[1.05] font-bold text-white">
                    Meeting Management
                    <br />
                    Hub
                  </h2>

                  <p className="mt-3 text-[16px] text-white/70 max-w-[600px]">
                    Manage student consultations, thesis reviews, and lab
                    <br className="hidden md:block" />
                    guidance sessions.
                  </p>

                </div>


                {/* New appointment */}
                <button 
                onClick={() => setShowAppointmentModal(true)}
                className="bg-[#062746] text-white rounded-lg px-5 py-3 flex items-center gap-2 text-[13px] font-semibold hover:bg-[#0A365D]">

                  <Plus size={18} />

                  <span>
                    New
                    <br />
                    Appointment
                  </span>

                </button>

              </div>


              {/* =================================================
                  STAT CARDS
              ================================================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">


                {/* Pending Requests */}
                <div className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm h-[138px]">

                  <div className="flex justify-between">

                    <div className="w-9 h-9 rounded-lg bg-[#FFF4D8] flex items-center justify-center text-[#F79009]">

                      <ClipboardList size={20} />

                    </div>

                    <span className="rounded-full bg-[#FFD9D5] text-[#B42318] text-[10px] px-3 py-1 h-fit">
                      +3 since
                      <br />
                      yesterday
                    </span>

                  </div>

                  <div className="mt-5">

                    <div className="text-[27px] font-bold">
                      12
                    </div>

                    <div className="text-[11px] font-semibold tracking-wide text-[#475467] mt-1">
                      PENDING REQUESTS
                    </div>

                  </div>

                </div>


                {/* Meetings Today */}
                <div className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm h-[138px]">

                  <div className="w-9 h-9 rounded-lg bg-[#E9EEF4] flex items-center justify-center text-[#062746]">

                    <CalendarCheck size={20} />

                  </div>

                  <div className="mt-5">

                    <div className="text-[27px] font-bold">
                      4
                    </div>

                    <div className="text-[11px] font-semibold tracking-wide text-[#475467] mt-1">
                      MEETINGS TODAY
                    </div>

                  </div>

                </div>


                {/* Upcoming Lab */}
                <div className="relative overflow-hidden bg-[#062746] text-white rounded-xl p-4 shadow-sm h-[150px]">

                  {/* Decorative circle */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#17466F] opacity-50"></div>

                  <div className="relative">

                    <div className="w-9 h-9 rounded-lg bg-[#345675] flex items-center justify-center">

                      <FlaskConical size={20} />

                    </div>

                    <div className="mt-5">

                      <div className="text-[27px] font-bold">
                        2
                      </div>

                      <div className="text-[11px] font-semibold tracking-wide">
                        UPCOMING LAB
                        <br />
                        SESSIONS
                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  REQUEST QUEUE
              ================================================== */}
              <section className="bg-white border border-[#D0D5DD] rounded-xl shadow-sm overflow-hidden">

                {/* Header */}
                <div className="h-[63px] px-4 flex items-center justify-between border-b border-[#D0D5DD]">

                  <div className="flex items-center gap-2">

                    <Inbox size={21} />

                    <h2 className="text-[20px] font-bold">
                      Request Queue
                    </h2>

                  </div>


                  <div className="flex gap-5 text-[#475467]">

                    <button>
                      <SlidersHorizontal size={18} />
                    </button>

                    <button>
                      <ListFilter size={18} />
                    </button>

                  </div>

                </div>


                {/* Requests */}
                <div className="p-4 space-y-4">

                  {meetings.length === 0 ? (
                    <div className="text-center py-8 text-[#475467]">
                      No meeting requests found.
                    </div>
                  ) : (
                    meetings
                      .filter((meeting) => meeting.status === "pending")
                      .map((meeting) => {

                      const meetingDate = meeting.preferred_date
                        ? new Date(meeting.preferred_date).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "Asia/Colombo",
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            }
                          )
                        : "Date not available";

                      const meetingTime = meeting.preferred_time
                        ? meeting.preferred_time.slice(0, 5)
                        : "--";

                      const initials = meeting.student_name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={meeting.request_id}
                          className="border border-[#D0D5DD] rounded-lg p-4"
                        >

                          {/* Student */}
                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-full bg-[#EDF2FF] text-[#23456D] flex items-center justify-center font-medium">
                                {initials}
                              </div>

                              <div>

                                <h3 className="text-[14px] font-bold">
                                  {meeting.student_name}
                                </h3>

                                <p className="text-[13px] text-[#475467]">
                                  Student ID: {meeting.student_id}
                                </p>

                              </div>

                            </div>

                            <span className="bg-[#F0F3F8] text-[#475467] rounded-full px-3 py-1 text-[10px] font-medium tracking-wide">
                              {meeting.status?.toUpperCase()}
                            </span>

                          </div>


                          {/* Purpose */}
                          <div className="mt-3">

                            <p className="text-[13px] font-semibold text-[#344054]">
                              {meeting.purpose}
                            </p>

                          </div>


                          {/* Date and Time */}
                          <div className="mt-3 bg-[#F8FAFC] rounded-md px-3 py-2 flex items-center gap-3 text-[13px] text-[#475467]">

                            <CalendarDays size={16} />

                            <span>
                              {meetingDate}
                            </span>

                            <span>
                              •
                            </span>

                            <Clock3 size={16} />

                            <span>
                              {meetingTime}
                            </span>

                          </div>


                          {/* Location */}
                          {meeting.location && (
                            <div className="mt-2 text-[12px] text-[#475467]">
                              <strong>Location:</strong> {meeting.location}
                            </div>
                          )}


                          {/* Response */}
                          {meeting.response && (
                            <div className="mt-2 text-[12px] text-[#475467]">
                              <strong>Response:</strong> {meeting.response}
                            </div>
                          )}
                          {meeting.status === "pending" && (
                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                      onClick={async () => {
                                    try {
                                      const response = await fetch(
                                        `http://localhost:3000/api/lecturer/meetings/${meeting.request_id}/decline`,
                                        {
                                          method: "PATCH",
                                          headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                          },
                                        }
                                      );

                                      const data = await response.json();

                                      if (!response.ok) {
                                        alert(data.error || "Failed to decline meeting.");
                                        return;
                                      }

                                      alert("Meeting request declined.");

                                      setMeetings((currentMeetings) =>
                                        currentMeetings.map((item) =>
                                          item.request_id === meeting.request_id
                                            ? data.meeting
                                            : item
                                        )
                                      );

                                    } catch (error) {
                                      console.error("Decline meeting error:", error);
                                      alert("Could not connect to the server.");
                                    }
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D0D5DD] text-[#344054] text-[13px] font-medium hover:bg-[#F9FAFB]"
                                >
                                  Decline
                                </button>
                                <button
                                onClick={async () => {
                                 try {
                                const response = await fetch(
                                      `http://localhost:3000/api/lecturer/meetings/${meeting.request_id}/approve`,
                                      {
                                        method: "PATCH",
                                        headers: {
                                          Authorization: `Bearer ${accessToken}`,
                                        },
                                      }
                                    );

                                    const data = await response.json();

                                    if (!response.ok) {
                                      alert(data.error || "Failed to approve meeting.");
                                      return;
                                    }

                                    alert("Meeting request approved.");

                                    setMeetings((currentMeetings) =>
                                      currentMeetings.map((item) =>
                                        item.request_id === meeting.request_id
                                          ? data.meeting
                                          : item
                                      )
                                    );

                                  } catch (error) {
                                    console.error("Approve meeting error:", error);
                                    alert("Could not connect to the server.");
                                  }
                                }}
                                className="bg-[#12B76A] text-white rounded-md px-4 py-2 text-[12px] font-semibold flex items-center gap-1 hover:bg-[#0E9F5D]"
                              >
                                <Check size={14} />
                                Approve
                              </button>
                            </div>
                          )}

                                  </div>
                                );
                              })
                            )}

                          </div>
                        </section>

                      </div>


            {/* =================================================
                RIGHT - WEEKLY SCHEDULE
            ================================================== */}
            <section className="bg-white border border-[#D0D5DD] rounded-xl shadow-sm overflow-hidden">


              {/* Header */}
              <div className="p-4 border-b border-[#D0D5DD]">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-[21px] font-bold">
                      Weekly Schedule
                    </h2>

                    <p className="text-[11px] text-[#667085] mt-1">
                      {scheduleDateRange}
                    </p>

                  </div>


                  <div className="flex gap-4">

                    <button
                      onClick={() => setWeekOffset((current) => current - 1)}
                      className="text-[#344054]"
                    >
                      <ChevronLeft size={19} />
                    </button>

                    <button
                      onClick={() => setWeekOffset((current) => current + 1)}
                      className="text-[#344054]"
                    >
                      <ChevronRight size={19} />
                    </button>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CALENDAR
              ================================================== */}
              <div className="p-4 border-b border-[#D0D5DD]">

                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center mb-4">

                  {["M", "T", "W", "T", "F", "S", "S"].map(
                    (day, index) => (
                      <span
                        key={index}
                        className="text-[10px] font-semibold text-[#667085]"
                      >
                        {day}
                      </span>
                    )
                  )}

                </div>
                  {/* Schedule dates */}
                  <div className="grid grid-cols-7 text-center">
                    {scheduleDates.map((date, index) => {
                      console.log(
                          "Confirmed meetings:",
                          confirmedMeetings.map((meeting) => ({
                            request_id: meeting.request_id,
                            confirmed_date: meeting.confirmed_date,
                          }))
                        );

                        const hasMeeting = confirmedMeetings.some((meeting) => {
                          if (!meeting.confirmed_date) return false;

                          const meetingDateKey = String(meeting.confirmed_date).slice(0, 10);

                          const calendarDateKey =
                            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                          return meetingDateKey === calendarDateKey;
                        });

                        const isToday =
                          date.getFullYear() === today.getFullYear() &&
                          date.getMonth() === today.getMonth() &&
                          date.getDate() === today.getDate();
                      
                      
                      return (
                        <span
                          key={index}
                          className={`relative text-[12px] py-2 ${
                            isToday && hasMeeting
                              ? "font-semibold text-red-600"
                              : isToday
                              ? "font-semibold text-blue-600"
                              : hasMeeting
                              ? "font-semibold text-green-600"
                              : "text-[#475467]"
                          }`}
                        >
                          {date.getDate()}

                          {hasMeeting && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#062746]"></span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  {/* Calendar Legend */}
                    <div className="flex items-center justify-center gap-5 pt-3">

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="text-[10px] text-[#475467]">Today</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        <span className="text-[10px] text-[#475467]">Meeting</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span className="text-[10px] text-[#475467]">
                          Today + Meeting
                        </span>
                      </div>

              </div>
              </div>


              {/* =================================================
                  TODAY'S AGENDA
              ================================================== */}
              <div className="p-4">

                <h3 className="text-[12px] font-bold text-[#475467] mb-5">
                  TODAY'S AGENDA 
                </h3>


                {/* Timeline */}
                  <div className="relative pl-6">

                    <div className="absolute left-[7px] top-1 bottom-2 w-px bg-[#D0D5DD]"></div>

                    {confirmedMeetings.length === 0 ? (
                      <div className="text-center py-8 text-[#475467]">
                        No confirmed meetings scheduled.
                      </div>
                    ) : (
                      todaysMeetings.map((meeting) => {
                        const meetingDate = meeting.confirmed_date
                          ? new Date(meeting.confirmed_date).toLocaleDateString(
                              "en-US",
                              {
                                timeZone: "Asia/Colombo",
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              }
                            )
                          : "Date not available";

                        const meetingTime = meeting.confirmed_time
                          ? meeting.confirmed_time.slice(0, 5)
                          : "--";

                        return (
                          <div
                            key={meeting.request_id}
                            className="relative mb-5"
                          >

                            <div className="absolute -left-[22px] top-2 w-2 h-2 rounded-full bg-[#496B99]"></div>

                            <p className="text-[11px] text-[#475467] mb-2">
                              {meetingDate} - {meetingTime}
                            </p>

                            <div className="bg-[#F2F5FB] border border-[#D8E2F2] rounded-md p-3">

                              <h4 className="text-[14px] font-semibold">
                                {meeting.purpose}
                              </h4>

                              <p className="text-[11px] text-[#475467] mt-2 flex items-center gap-1">
                                <Users size={13} />
                                {meeting.student_name}
                              </p>

                              <p className="text-[11px] text-[#475467] mt-1 flex items-center gap-1">
                                <MapPin size={13} />
                                {meeting.location || "Location not assigned"}
                              </p>

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
      
      {showAppointmentModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">
      
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[#071B38]">
          Create New Appointment
        </h2>

        <button
          onClick={() => setShowAppointmentModal(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">

        {/* Student */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Student
          </label>
          <input
            type="text"
            placeholder="Enter student name or ID"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Purpose
          </label>
          <input
            type="text"
            placeholder="e.g. Thesis Review"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Time
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={() => setShowAppointmentModal(false)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              alert("Appointment created successfully.");
              setShowAppointmentModal(false);
            }}
            className="px-5 py-2 rounded-lg bg-[#062746] text-white hover:bg-[#0A365D]"
          >
            Create Appointment
          </button>
        </div>

      </div>
    </div>
  </div>
)}
{showTimeModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-[450px] p-6">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[#071B38]">
          Propose New Time
        </h2>

        <button
          onClick={() => setShowTimeModal(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">
            New Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Time
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#062746]"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-3">

          <button
            onClick={() => setShowTimeModal(false)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              alert("New meeting time proposed successfully.");
              setShowTimeModal(false);
            }}
            className="px-5 py-2 rounded-lg bg-[#062746] text-white hover:bg-[#0A365D]"
          >
            Propose Time
          </button>

        </div>

      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default MeetingManagement;