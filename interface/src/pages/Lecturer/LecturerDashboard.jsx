import React from "react";
import Sidenavbar from "../../components/Sidenavbar";
import Topnavbar from "../../components/Topnavbar";

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
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

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
            <h1 className="text-4xl font-bold text-[#06264A] tracking-tight">
              Overview
            </h1>

            <p className="text-[15px] text-slate-600 mt-2">
              Welcome back, Dr. Silva. Here is your daily digest.
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
                  87.4%
                </span>

                <span className="text-xs font-medium text-green-600">
                  ↗ +2.1%
                </span>

              </div>

            </div>


            {/* -------- Pending Medicals Card -------- */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm min-h-[140px]">

              <div className="flex items-start justify-between">

                <span className="text-[11px] font-bold tracking-wider text-slate-600">
                  PENDING MEDICALS
                </span>

                <div className="w-9 h-9 rounded-lg bg-[#FF5B4F] text-white flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>

              </div>

              <div className="flex items-baseline gap-3 mt-7">

                <span className="text-4xl font-bold text-[#06264A]">
                  14
                </span>

                <span className="text-xs font-medium text-red-600">
                  Action Required
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
                  3
                </span>

                <span className="text-xs text-slate-600">
                  Next at 11:30 AM
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

                <button className="text-[11px] font-bold text-[#06264A] hover:text-blue-600">
                  VIEW ALL
                </button>

              </div>


              {/* Items */}
              <div className="p-4 space-y-3">

                {/* Medical Leave */}
                <div className="flex items-center gap-4 border border-slate-200 rounded-lg p-4">

                  <div className="w-10 h-10 rounded-full bg-[#FFD9D5] text-red-600 flex items-center justify-center shrink-0">
                    <BriefcaseMedical className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Medical Leave Approval: S. Perera
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      Submitted 2 hours ago • ICT 202
                    </p>
                  </div>

                </div>


                {/* Grade Roster */}
                <div className="flex items-center gap-4 border border-slate-200 rounded-lg p-4">

                  <div className="w-10 h-10 rounded-full bg-[#DCE9FF] text-[#174A88] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Finalize Grade Roster: ET1014
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      Due Tomorrow, 5:00 PM
                    </p>
                  </div>

                </div>


                {/* Reschedule */}
                <div className="flex items-center gap-4 border border-slate-200 rounded-lg p-4">

                  <div className="w-10 h-10 rounded-full bg-[#FFDFCC] text-[#8A3C12] flex items-center justify-center shrink-0">
                    <Clock3 className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Reschedule Request: Faculty Senate
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      Requested by Dean's Office
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

                  <button className="text-slate-600 hover:text-slate-900">
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button className="text-slate-600 hover:text-slate-900">
                    <ChevronRight className="w-5 h-5" />
                  </button>

                </div>

              </div>


              {/* Calendar */}
              <div className="mt-6">

                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center mb-3">

                  <span className="text-[11px] font-semibold text-slate-500">M</span>
                  <span className="text-[11px] font-semibold text-slate-500">T</span>
                  <span className="text-[11px] font-semibold text-slate-500">W</span>
                  <span className="text-[11px] font-semibold text-slate-500">T</span>
                  <span className="text-[11px] font-semibold text-slate-500">F</span>
                  <span className="text-[11px] font-semibold text-slate-500">S</span>
                  <span className="text-[11px] font-semibold text-slate-500">S</span>

                </div>


                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-y-2 text-center">

                  <span className="text-xs text-slate-300 p-2">28</span>
                  <span className="text-xs text-slate-300 p-2">29</span>
                  <span className="text-xs text-slate-700 p-2">1</span>
                  <span className="text-xs text-slate-700 p-2">2</span>
                  <span className="text-xs text-slate-700 p-2">3</span>
                  <span className="text-xs text-slate-700 p-2">4</span>
                  <span className="text-xs text-slate-700 p-2">5</span>

                  <span className="text-xs text-slate-700 p-2">6</span>
                  <span className="text-xs text-slate-700 p-2">7</span>

                  <span className="w-8 h-8 mx-auto rounded-full bg-[#06264A] text-white flex items-center justify-center text-xs">
                    8
                  </span>

                  <span className="relative text-xs text-slate-700 p-2">
                    9
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-600"></span>
                  </span>

                  <span className="relative text-xs text-slate-700 p-2">
                    10
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#06264A]"></span>
                  </span>

                  <span className="text-xs text-slate-700 p-2">11</span>
                  <span className="text-xs text-slate-700 p-2">12</span>

                </div>

              </div>


              {/* Today's Agenda */}
              <div className="border-t border-slate-200 mt-5 pt-4">

                <h3 className="text-[11px] font-bold text-slate-600 mb-4">
                  TODAY'S AGENDA
                </h3>


                {/* 11:30 AM */}
                <div className="grid grid-cols-[48px_1fr] gap-3 mb-4">

                  <div>
                    <strong className="block text-sm text-[#06264A]">
                      11:30
                    </strong>

                    <span className="text-[11px] text-slate-500">
                      AM
                    </span>
                  </div>

                  <div className="bg-[#EDF3FF] border-l-4 border-[#06264A] rounded-r-md p-3">

                    <strong className="block text-sm text-slate-800">
                      Dept. Sync
                    </strong>

                    <span className="text-xs text-slate-600">
                      Room 304
                    </span>

                  </div>

                </div>


                {/* 2:00 PM */}
                <div className="grid grid-cols-[48px_1fr] gap-3">

                  <div>
                    <strong className="block text-sm text-[#06264A]">
                      2:00
                    </strong>

                    <span className="text-[11px] text-slate-500">
                      PM
                    </span>
                  </div>

                  <div className="bg-[#FFF0EE] border-l-4 border-red-600 rounded-r-md p-3">

                    <strong className="block text-sm text-slate-800">
                      Student Consultation
                    </strong>

                    <span className="text-xs text-slate-600">
                      Online (Zoom)
                    </span>

                  </div>

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