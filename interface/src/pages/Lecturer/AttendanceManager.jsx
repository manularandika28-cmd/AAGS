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
  Search,
  Fingerprint,
  Pause,
  CircleStop,
  CheckCircle2,
  Timer,
  RefreshCw,
  Info,
  UserRoundCheck,
  ChevronDown,
} from "lucide-react";


const AttendanceManager = () => {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#071B38]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="w-[280px] min-h-screen bg-[#062746] text-white flex flex-col shrink-0">

        {/* Faculty Logo */}
        <div className="px-5 pt-7 pb-5 flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
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
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] cursor-pointer hover:bg-white/10">

            <LayoutDashboard size={21} />

            <span className="text-[12px] font-semibold">
              DASHBOARD
            </span>

          </div>


          {/* Meeting Requests */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] cursor-pointer hover:bg-white/10">

            <CalendarDays size={21} />

            <span className="text-[12px] font-semibold">
              MEETING REQUESTS
            </span>

          </div>


          {/* Medical Review */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] cursor-pointer hover:bg-white/10">

            <BriefcaseMedical size={21} />

            <span className="text-[12px] font-semibold">
              MEDICAL REVIEW
            </span>

          </div>


          {/* Academic Records - ACTIVE */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md bg-[#FF5B4F] text-[#111827] cursor-pointer">

            <GraduationCap size={21} />

            <span className="text-[12px] font-semibold">
              ACADEMIC RECORDS
            </span>

          </div>


          {/* Governance */}
          <div className="h-[43px] flex items-center gap-4 px-4 rounded-md text-[#D7E3F0] cursor-pointer hover:bg-white/10">

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
          MAIN AREA
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

            {/* Notification */}
            <button className="text-[#344054] hover:text-[#071B38]">
              <Bell size={21} />
            </button>


            {/* Help */}
            <button className="text-[#344054] hover:text-[#071B38]">
              <CircleHelp size={21} />
            </button>


            {/* Settings */}
            <span className="text-[12px] font-semibold text-[#071B38]">
              Settings
            </span>


            {/* Profile */}
            <div className="w-8 h-8 rounded-full bg-[#E6EBF0] flex items-center justify-center overflow-hidden">

              <UserRound
                size={18}
                className="text-[#344054]"
              />

            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}
        <main className="px-8 py-8">


          {/* =================================================
              SESSION HEADER
          ================================================== */}
          <div className="flex items-end justify-between mb-6">

            <div>

              {/* Live Session */}
              <div className="flex items-center gap-4 mb-2">

                <span className="inline-flex items-center rounded-full bg-[#00427C] text-white px-3 py-1 text-[11px] font-semibold tracking-wider">
                  LIVE SESSION
                </span>

                <span className="w-3 h-3 rounded-full bg-[#12B76A]"></span>

              </div>


              {/* Module */}
              <h2 className="text-[36px] leading-tight font-bold text-[#071B38] max-w-[650px]">
                IT3045: Advanced Database
                <br />
                Systems
              </h2>


              {/* Session details */}
              <p className="mt-3 text-[15px] text-[#475467]">
                Lecture • Week 7 • Dr. A. Perera
              </p>

            </div>


            {/* Session buttons */}
            <div className="flex items-center gap-4 pb-1">

              {/* Pause */}
              <button className="w-[158px] h-[58px] rounded-lg bg-[#E8F0FD] border border-[#D8E2F2] text-[#071B38] flex items-center justify-center gap-3 shadow-sm hover:bg-[#DDE9FA]">

                <Pause
                  size={19}
                  fill="currentColor"
                />

                <span className="text-[13px] font-semibold leading-tight">
                  Pause
                  <br />
                  Scanner
                </span>

              </button>


              {/* End */}
              <button className="w-[146px] h-[58px] rounded-lg bg-[#F04444] text-white flex items-center justify-center gap-3 shadow-sm hover:bg-[#DC3838]">

                <CircleStop size={21} />

                <span className="text-[13px] font-semibold leading-tight">
                  End
                  <br />
                  Session
                </span>

              </button>

            </div>

          </div>


          {/* =================================================
              MAIN GRID
          ================================================== */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_303px] gap-6">


            {/* =================================================
                LEFT SIDE
            ================================================== */}
            <div className="min-w-0">


              {/* =============================================
                  STAT CARDS
              ============================================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">


                {/* Currently Marked */}
                <div className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm h-[130px]">

                  <div className="flex justify-between items-start">

                    <span className="text-[11px] font-semibold tracking-wide text-[#475467]">
                      Currently Marked
                    </span>

                    <Fingerprint
                      size={24}
                      className="text-[#00427C]"
                    />

                  </div>

                  <div className="mt-4">

                    <div className="text-[36px] leading-none font-bold text-[#071B38]">
                      87
                    </div>

                    <p className="text-[13px] text-[#475467] mt-2">
                      out of 120 enrolled
                    </p>

                  </div>

                </div>


                {/* Session Progress */}
                <div className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm h-[130px]">

                  <div className="flex justify-between items-start">

                    <span className="text-[11px] font-semibold tracking-wide text-[#475467]">
                      Session Progress
                    </span>

                    <CheckCircle2
                      size={23}
                      className="text-[#12B76A]"
                    />

                  </div>

                  <div className="mt-4">

                    <div className="text-[36px] leading-none font-bold text-[#071B38]">
                      72.5%
                    </div>


                    {/* Progress bar */}
                    <div className="mt-3 w-full h-[9px] bg-[#D5E3F8] rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#12B76A] rounded-full"
                        style={{ width: "72.5%" }}
                      ></div>

                    </div>

                  </div>

                </div>


                {/* Elapsed Time */}
                <div className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm h-[130px]">

                  <div className="flex justify-between items-start">

                    <span className="text-[11px] font-semibold tracking-wide text-[#475467]">
                      Elapsed Time
                    </span>

                    <Timer
                      size={23}
                      className="text-[#F79009]"
                    />

                  </div>

                  <div className="mt-4">

                    <div className="text-[36px] leading-none font-bold text-[#071B38]">
                      45:12
                    </div>

                    <p className="text-[13px] text-[#475467] mt-2">
                      Started at 08:00 AM
                    </p>

                  </div>

                </div>

              </div>


              {/* =============================================
                  LIVE VERIFICATION FEED
              ============================================== */}
              <section className="bg-white border border-[#D0D5DD] rounded-xl overflow-hidden shadow-sm">


                {/* Feed Header */}
                <div className="h-[62px] px-4 flex items-center justify-between border-b border-[#D0D5DD]">

                  <div className="flex items-center gap-2">

                    <h2 className="text-[20px] font-bold text-[#071B38]">
                      Live Verification Feed
                    </h2>

                    <RefreshCw
                      size={14}
                      className="text-[#475467]"
                    />

                  </div>


                  {/* Search */}
                  <div className="relative w-[192px]">

                    <Search
                      size={15}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#667085]"
                    />

                    <input
                      type="text"
                      placeholder="Filter by ID..."
                      className="w-full h-[31px] pl-8 pr-3 rounded-md border border-[#D0D5DD] bg-white text-[12px] outline-none focus:ring-2 focus:ring-[#00427C]/20"
                    />

                  </div>

                </div>


                {/* Table Header */}
                <div className="grid grid-cols-[103px_125px_1fr_155px_72px] bg-[#F8F9FC] border-b border-[#E5E7EB] px-4 py-3">

                  <span className="text-[11px] font-semibold text-[#475467]">
                    Timestamp
                  </span>

                  <span className="text-[11px] font-semibold text-[#475467]">
                    Student ID
                  </span>

                  <span className="text-[11px] font-semibold text-[#475467]">
                    Name
                  </span>

                  <span className="text-[11px] font-semibold text-[#475467]">
                    Method
                  </span>

                  <span className="text-[11px] font-semibold text-[#475467]">
                    Status
                  </span>

                </div>


                {/* Row 1 */}
                <div className="grid grid-cols-[103px_125px_1fr_155px_72px] items-center px-4 py-4 border-b border-[#D0D5DD] min-h-[72px]">

                  <span className="text-[13px] text-[#475467]">
                    08:45:12
                  </span>

                  <span className="text-[13px] font-semibold text-[#071B38]">
                    2020/CS/101
                  </span>

                  <span className="text-[14px] text-[#071B38]">
                    Kamal Perera
                  </span>

                  <span className="text-[13px] text-[#475467] flex items-center gap-2">
                    <Fingerprint size={15} />
                    Scanner 1
                  </span>

                  <span className="justify-self-start rounded-full bg-[#ECFDF3] text-[#12B76A] px-3 py-1 text-[12px] font-medium">
                    ✓ Verified
                  </span>

                </div>


                {/* Row 2 */}
                <div className="grid grid-cols-[103px_125px_1fr_155px_72px] items-center px-4 py-4 border-b border-[#D0D5DD] min-h-[72px]">

                  <span className="text-[13px] text-[#475467]">
                    08:44:50
                  </span>

                  <span className="text-[13px] font-semibold text-[#071B38]">
                    2020/CS/085
                  </span>

                  <span className="text-[14px] text-[#071B38]">
                    Nimali Silva
                  </span>

                  <span className="text-[13px] text-[#475467] flex items-center gap-2">
                    <Fingerprint size={15} />
                    Scanner 2
                  </span>

                  <span className="justify-self-start rounded-full bg-[#ECFDF3] text-[#12B76A] px-3 py-1 text-[12px] font-medium">
                    ✓ Verified
                  </span>

                </div>


                {/* Row 3 - Failed */}
                <div className="grid grid-cols-[103px_125px_1fr_155px_72px] items-center px-4 py-4 border-b border-[#D0D5DD] min-h-[80px] bg-[#FFF8F7]">

                  <span className="text-[13px] text-[#475467]">
                    08:42:15
                  </span>

                  <span className="text-[13px] font-semibold text-[#071B38]">
                    2020/CS/112
                  </span>

                  <span className="text-[14px] text-[#071B38] leading-tight">
                    Unknown /
                    <br />
                    Mismatch
                  </span>

                  <span className="text-[13px] text-[#475467] flex items-center gap-2">
                    <Fingerprint size={15} />
                    Scanner 1
                  </span>

                  <span className="justify-self-start rounded-full bg-[#FFD9D5] text-[#B42318] px-3 py-2 text-[12px] font-medium text-center leading-tight">
                    ⓘ Failed
                    <br />
                    (Retry)
                  </span>

                </div>


                {/* Row 4 - Manual */}
                <div className="grid grid-cols-[103px_125px_1fr_155px_72px] items-center px-4 py-4 border-b border-[#D0D5DD] min-h-[72px]">

                  <span className="text-[13px] text-[#475467]">
                    08:40:05
                  </span>

                  <span className="text-[13px] font-semibold text-[#071B38]">
                    2020/CS/042
                  </span>

                  <span className="text-[14px] text-[#071B38] leading-tight">
                    Ruwan
                    <br />
                    Bandara
                  </span>

                  <span className="text-[13px] text-[#475467] flex items-center gap-2">
                    <UserRoundCheck size={15} />
                    Manual
                    <br />
                    Override
                  </span>

                  <span className="justify-self-start rounded-full bg-[#FFFAEB] text-[#B54708] px-3 py-1 text-[12px] font-medium">
                    ♢ Manual
                  </span>

                </div>


                {/* Row 5 */}
                <div className="grid grid-cols-[103px_125px_1fr_155px_72px] items-center px-4 py-4 min-h-[72px]">

                  <span className="text-[13px] text-[#475467]">
                    08:38:22
                  </span>

                  <span className="text-[13px] font-semibold text-[#071B38]">
                    2020/CS/005
                  </span>

                  <span className="text-[14px] text-[#071B38]">
                    Saman Kumara
                  </span>

                  <span className="text-[13px] text-[#475467] flex items-center gap-2">
                    <Fingerprint size={15} />
                    Scanner 2
                  </span>

                  <span className="justify-self-start rounded-full bg-[#ECFDF3] text-[#12B76A] px-3 py-1 text-[12px] font-medium">
                    ✓ Verified
                  </span>

                </div>

              </section>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================== */}
            <div className="space-y-6">


              {/* =============================================
                  ATTENDANCE ANALYSIS
              ============================================== */}
              <section className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm">

                <h2 className="text-[20px] font-bold text-[#071B38]">
                  Attendance Analysis
                </h2>

                <div className="border-t border-[#D0D5DD] mt-3 pt-4">

                  <div className="flex items-baseline gap-3">

                    <span className="text-[36px] font-bold text-[#071B38]">
                      72.5%
                    </span>

                    <span className="text-[13px] text-[#475467]">
                      Current Session
                    </span>

                  </div>


                  {/* Threshold */}
                  <div className="flex justify-between mt-4">

                    <span className="text-[13px] text-[#475467]">
                      Target Threshold (75%)
                    </span>

                    <span className="text-[13px] text-[#F79009]">
                      2.5% short
                    </span>

                  </div>


                  {/* Progress */}
                  <div className="relative mt-2 h-[8px] rounded-full bg-[#D5E3F8] overflow-visible">

                    <div
                      className="h-full bg-[#062746] rounded-full"
                      style={{ width: "72.5%" }}
                    ></div>

                    {/* Target marker */}
                    <div className="absolute top-[-4px] left-[75%] w-[2px] h-[16px] bg-[#B54708]"></div>

                  </div>


                  {/* Information box */}
                  <div className="mt-4 bg-[#EFF4FC] border border-[#D8E3F3] rounded-lg p-3 flex gap-2">

                    <Info
                      size={16}
                      className="text-[#062746] mt-0.5 shrink-0"
                    />

                    <p className="text-[13px] leading-5 text-[#475467]">
                      Need <strong>3 more students</strong> to reach
                      the 75% module requirement threshold for this
                      session.
                    </p>

                  </div>

                </div>

              </section>


              {/* =============================================
                  MANUAL OVERRIDE
              ============================================== */}
              <section className="bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-sm">

                <h2 className="text-[20px] font-bold text-[#071B38]">
                  Manual Override
                </h2>

                <div className="border-t border-[#D0D5DD] mt-3 pt-4 space-y-4">


                  {/* Registration number */}
                  <div>

                    <label className="block text-[12px] font-semibold text-[#475467] mb-2">
                      Student Registration Number
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 2020/CS/001"
                      className="w-full h-[41px] rounded-lg border border-[#D0D5DD] bg-[#F8FAFC] px-3 text-[14px] text-[#344054] outline-none focus:ring-2 focus:ring-[#00427C]/20"
                    />

                  </div>


                  {/* Reason */}
                  <div>

                    <label className="block text-[12px] font-semibold text-[#475467] mb-2">
                      Reason for Manual Entry
                    </label>

                    <div className="relative">

                      <select
                        defaultValue="Fingerprint Not Recognized"
                        className="appearance-none w-full h-[41px] rounded-lg border border-[#D0D5DD] bg-[#F8FAFC] px-3 pr-9 text-[14px] text-[#344054] outline-none focus:ring-2 focus:ring-[#00427C]/20"
                      >
                        <option>
                          Fingerprint Not Recognized
                        </option>

                        <option>
                          Scanner Error
                        </option>

                        <option>
                          Student ID Issue
                        </option>

                        <option>
                          Other
                        </option>

                      </select>

                      <ChevronDown
                        size={17}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
                      />

                    </div>

                  </div>


                  {/* Button */}
                  <button className="w-full h-[37px] rounded-lg bg-[#00427C] text-white text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#003560]">

                    <UserRoundCheck size={16} />

                    Mark Present Manually

                  </button>

                </div>

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AttendanceManager;