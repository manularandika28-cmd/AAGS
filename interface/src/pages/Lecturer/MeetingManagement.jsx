import React from "react";

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
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#071B38]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="w-[280px] min-h-screen bg-[#062746] text-white flex flex-col shrink-0">

        {/* Faculty Header */}
        <div className="px-5 pt-7 pb-5 flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <GraduationCap
              size={22}
              className="text-[#062746]"
            />
          </div>

          <div>
            <h2 className="text-[20px] font-bold leading-tight">
              Faculty of
              <br />
              Technology
            </h2>

            <p className="text-[11px] tracking-wide text-[#A9BDD4] mt-1">
              UNIVERSITY OF COLOMBO
            </p>
          </div>

        </div>


        {/* Navigation */}
        <nav className="mt-3 px-5 space-y-2">

          {/* Dashboard */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] hover:bg-white/10 cursor-pointer">

            <LayoutDashboard size={21} />

            <span className="text-[12px] font-semibold">
              DASHBOARD
            </span>

          </div>


          {/* Meeting Requests - ACTIVE */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md bg-[#FF5B4F] text-[#111827] cursor-pointer">

            <CalendarDays size={21} />

            <span className="text-[12px] font-semibold">
              MEETING REQUESTS
            </span>

          </div>


          {/* Medical Review */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] hover:bg-white/10 cursor-pointer">

            <BriefcaseMedical size={21} />

            <span className="text-[12px] font-semibold">
              MEDICAL REVIEW
            </span>

          </div>


          {/* Academic Records */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] hover:bg-white/10 cursor-pointer">

            <GraduationCap size={21} />

            <span className="text-[12px] font-semibold">
              ACADEMIC RECORDS
            </span>

          </div>


          {/* Governance */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] hover:bg-white/10 cursor-pointer">

            <Landmark size={21} />

            <span className="text-[12px] font-semibold">
              GOVERNANCE
            </span>

          </div>

        </nav>


        {/* Logout */}
        <div className="mt-auto px-12 pb-10 flex items-center gap-4 text-[#D7E3F0]">

          <LogOut size={20} />

          <span className="text-[12px] font-semibold">
            LOG OUT
          </span>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="flex-1 min-w-0">


        {/* ===================================================
            TOP HEADER
        ==================================================== */}
        <header className="h-[65px] bg-white border-b border-[#D0D5DD] flex items-center justify-between px-7">

          <h1 className="text-[24px] font-bold text-[#071B38]">
            AAGS Faculty System
          </h1>


          <div className="flex items-center gap-7">

            {/* Search */}
            <div className="hidden lg:flex items-center w-[405px] h-[40px] border border-[#D0D5DD] rounded-full px-4">

              <svg
                className="w-5 h-5 text-[#667085] mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="text"
                placeholder="Search students, topics, or meetings..."
                className="w-full outline-none text-[13px] text-[#344054] placeholder:text-[#667085]"
              />

            </div>


            {/* Notification */}
            <button className="relative text-[#344054]">

              <Bell size={21} />

              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F04438]"></span>

            </button>


            {/* Help */}
            <button className="text-[#344054]">
              <CircleHelp size={21} />
            </button>


            <div className="h-7 w-px bg-[#D0D5DD]"></div>


            {/* Settings */}
            <span className="text-[12px] font-semibold">
              Settings
            </span>


            {/* Profile */}
            <div className="w-8 h-8 rounded-full bg-[#E6EBF0] flex items-center justify-center">

              <UserRound
                size={18}
                className="text-[#344054]"
              />

            </div>

          </div>

        </header>


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

                  <h2 className="text-[38px] leading-[1.05] font-bold text-[#071B38]">
                    Meeting Management
                    <br />
                    Hub
                  </h2>

                  <p className="mt-3 text-[16px] text-[#475467]">
                    Manage student consultations, thesis reviews, and lab
                    <br className="hidden md:block" />
                    guidance sessions.
                  </p>

                </div>


                {/* New appointment */}
                <button className="bg-[#062746] text-white rounded-lg px-5 py-3 flex items-center gap-2 text-[13px] font-semibold hover:bg-[#0A365D]">

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


                  {/* =================================================
                      REQUEST 1
                  ================================================== */}
                  <div className="border border-[#D0D5DD] rounded-lg p-4">

                    {/* Student */}
                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-[#EDF2FF] text-[#23456D] flex items-center justify-center font-medium">
                          AS
                        </div>

                        <div>

                          <h3 className="text-[14px] font-bold">
                            Amaya Silva
                          </h3>

                          <p className="text-[13px] text-[#475467]">
                            STU-2021-045
                          </p>

                        </div>

                      </div>


                      <span className="bg-[#F0F3F8] text-[#475467] rounded-full px-3 py-1 text-[10px] font-medium tracking-wide">
                        THESIS REVIEW
                      </span>

                    </div>


                    {/* Date and time */}
                    <div className="mt-3 bg-[#F8FAFC] rounded-md px-3 py-2 flex items-center gap-3 text-[13px] text-[#475467]">

                      <CalendarDays size={16} />

                      <span>
                        Oct 24, 2023
                      </span>

                      <span>
                        •
                      </span>

                      <Clock3 size={16} />

                      <span>
                        10:00 AM - 10:30 AM
                      </span>

                    </div>


                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">

                      <button className="border border-[#F04438] text-[#F04438] rounded-md px-4 py-2 text-[12px] font-semibold hover:bg-[#FEF3F2]">
                        Decline
                      </button>

                      <button className="border border-[#98A2B3] text-[#475467] rounded-md px-4 py-2 text-[12px] font-semibold hover:bg-[#F2F4F7]">
                        Reschedule
                      </button>

                      <button className="bg-[#12B76A] text-white rounded-md px-4 py-2 text-[12px] font-semibold flex items-center gap-1 hover:bg-[#0E9F5D]">

                        <Check size={14} />

                        Approve

                      </button>

                    </div>

                  </div>


                  {/* =================================================
                      REQUEST 2 - OVERLAP
                  ================================================== */}
                  <div className="border border-[#F04438] border-l-4 rounded-lg bg-[#FFF8F7] p-4">

                    {/* Student */}
                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-[#EDF2FF] text-[#23456D] flex items-center justify-center font-medium">
                          KP
                        </div>

                        <div>

                          <h3 className="text-[14px] font-bold">
                            Kasun Perera
                          </h3>

                          <p className="text-[13px] text-[#475467]">
                            STU-2022-112
                          </p>

                        </div>

                      </div>


                      <span className="bg-[#F0F3F8] text-[#475467] rounded-full px-3 py-1 text-[10px] font-medium tracking-wide">
                        LAB GUIDANCE
                      </span>

                    </div>


                    {/* Date */}
                    <div className="mt-3 bg-[#F5F8FC] rounded-md px-3 py-2 flex items-center gap-3 text-[13px]">

                      <CalendarDays size={16} />

                      <span>
                        Oct 24, 2023
                      </span>

                      <span>
                        •
                      </span>

                      <Clock3 size={16} />

                      <span className="text-[#F04438] font-semibold">
                        14:00 PM - 15:00 PM
                      </span>

                    </div>


                    {/* Alert */}
                    <div className="mt-3 bg-[#FFD9D5] rounded-md p-3 flex gap-2">

                      <AlertTriangle
                        size={18}
                        className="text-[#B42318] shrink-0"
                      />

                      <div className="text-[12px] text-[#B42318]">

                        <div className="font-semibold">
                          Overlap Alert
                        </div>

                        <div className="mt-1">
                          Clashes with existing:
                          <strong>
                            {" "} "Faculty Senate Meeting"
                          </strong>
                          {" "} (13:30 - 15:30)
                        </div>

                      </div>

                    </div>


                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">

                      <button className="border border-[#F04438] text-[#F04438] rounded-md px-4 py-2 text-[12px] font-semibold">
                        Decline
                      </button>

                      <button className="border border-[#98A2B3] text-[#475467] rounded-md px-3 py-2 text-[12px] font-semibold flex items-center gap-1">

                        <CalendarClock size={14} />

                        Propose New Time

                      </button>

                      <button
                        disabled
                        className="bg-[#BCE8D0] text-white rounded-md px-4 py-2 text-[12px] font-semibold flex items-center gap-1 opacity-70"
                      >

                        <Check size={14} />

                        Approve

                      </button>

                    </div>

                  </div>

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

                    <p className="text-[13px] text-[#475467] mt-1">
                      Oct 23 - Oct 29, 2023
                    </p>

                  </div>


                  <div className="flex gap-4">

                    <button className="text-[#344054]">
                      <ChevronLeft size={19} />
                    </button>

                    <button className="text-[#344054]">
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


                {/* Previous week */}
                <div className="grid grid-cols-7 text-center mb-2">

                  {["16", "17", "18", "19", "20", "21", "22"].map(
                    (date) => (
                      <span
                        key={date}
                        className="text-[12px] text-[#98A2B3] py-2"
                      >
                        {date}
                      </span>
                    )
                  )}

                </div>


                {/* Current week */}
                <div className="grid grid-cols-7 text-center">

                  <span className="text-[12px] py-2">
                    23
                  </span>

                  <span className="w-8 h-8 mx-auto rounded-md bg-[#062746] text-white flex items-center justify-center text-[12px] font-semibold">
                    24
                  </span>

                  <span className="text-[12px] py-2">
                    25
                  </span>

                  <span className="relative text-[12px] py-2">
                    26
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#062746]"></span>
                  </span>

                  <span className="relative text-[12px] py-2">
                    27
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#062746]"></span>
                  </span>

                  <span className="text-[12px] py-2">
                    28
                  </span>

                  <span className="text-[12px] py-2">
                    29
                  </span>

                </div>

              </div>


              {/* =================================================
                  TODAY'S AGENDA
              ================================================== */}
              <div className="p-4">

                <h3 className="text-[12px] font-bold text-[#475467] mb-5">
                  TODAY'S AGENDA (OCT 24)
                </h3>


                {/* Timeline */}
                <div className="relative pl-6">

                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-1 bottom-2 w-px bg-[#D0D5DD]"></div>


                  {/* ===========================================
                      EVENT 1
                  ============================================ */}
                  <div className="relative mb-5">

                    <div className="absolute -left-[22px] top-2 w-2 h-2 rounded-full bg-[#496B99]"></div>

                    <p className="text-[11px] text-[#475467] mb-2">
                      08:00 AM - 10:00 AM
                    </p>

                    <div className="bg-[#F2F5FB] border border-[#D8E2F2] rounded-md p-3">

                      <h4 className="text-[14px] font-semibold">
                        Undergraduate Lecture: Data Structures
                      </h4>

                      <p className="text-[11px] text-[#475467] mt-2 flex items-center gap-1">

                        <MapPin size={13} />

                        Auditorium A

                      </p>

                    </div>

                  </div>


                  {/* ===========================================
                      EVENT 2 - PENDING
                  ============================================ */}
                  <div className="relative mb-5">

                    <div className="absolute -left-[22px] top-2 w-2 h-2 rounded-full bg-[#D0D5DD]"></div>

                    <p className="text-[11px] text-[#98A2B3] mb-2">
                      10:00 AM - 10:30 AM
                    </p>

                    <div className="border border-dashed border-[#BFD1E8] bg-[#FAFCFF] rounded-md p-3">

                      <p className="text-[14px] italic text-[#667085]">
                        Pending: Thesis Review (Amaya S.)
                      </p>

                    </div>

                  </div>


                  {/* ===========================================
                      EVENT 3
                  ============================================ */}
                  <div className="relative">

                    <div className="absolute -left-[22px] top-2 w-2 h-2 rounded-full bg-[#C0392B]"></div>

                    <p className="text-[11px] text-[#475467] mb-2">
                      13:30 PM - 15:30 PM
                    </p>

                    <div className="bg-[#FFD9D5] border border-[#FF9B91] rounded-md p-3">

                      <h4 className="text-[14px] font-semibold text-[#4A1714]">
                        Faculty Senate Meeting
                      </h4>

                      <p className="text-[11px] text-[#6B2A25] mt-2 flex items-center gap-1">

                        <Users size={13} />

                        Main Boardroom

                      </p>

                    </div>

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

export default MeetingManagement;