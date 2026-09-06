import React, { useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Send,
  AlertTriangle,
} from 'lucide-react';

const MeetingScheduler = () => {
  const [view, setView] = useState('week');
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [notes, setNotes] = useState('');

  const lecturers = [
    'Dr. Silva',
    'Prof. Perera',
    'Dr. Fernando',
    'Dr. Jayasinghe',
  ];

  const availableTimes = [
    { time: '09:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:00 PM', available: false },
  ];

  const days = [
    { day: 'MON', date: '16' },
    { day: 'TUE', date: '17', today: true },
    { day: 'WED', date: '18' },
    { day: 'THU', date: '19' },
    { day: 'FRI', date: '20' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedLecturer || !selectedDate || !selectedTime) {
      alert('Please select a lecturer, date and time.');
      return;
    }

    console.log({
      lecturer: selectedLecturer,
      date: selectedDate,
      time: selectedTime,
      notes,
    });

    alert('Meeting request submitted successfully.');
  };

  return (
    <div className="flex min-h-screen">

      {/* =========================================
          EXISTING SIDE NAVBAR
      ========================================== */}
      <Sidenavbar />

      {/* =========================================
          MAIN AREA
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Existing Top Navbar */}
        <Topnavbar />

        {/* =========================================
            PAGE CONTENT
        ========================================== */}
        <main className="p-8 max-w-[1400px] w-full mx-auto">

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_330px] gap-6 items-start">

            {/* =====================================
                CALENDAR CARD
            ====================================== */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">

                <h2 className="text-[23px] font-bold text-slate-900">
                  October 2023
                </h2>

                <div className="flex items-center gap-2">

                  {/* Week / Month */}
                  <div className="flex bg-[#E7EFFB] rounded-md p-1">

                    <button
                      onClick={() => setView('week')}
                      className={`px-4 py-1.5 rounded text-xs font-semibold transition ${
                        view === 'week'
                          ? 'bg-white text-[#071B38] shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Week
                    </button>

                    <button
                      onClick={() => setView('month')}
                      className={`px-4 py-1.5 rounded text-xs font-semibold transition ${
                        view === 'month'
                          ? 'bg-white text-[#071B38] shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Month
                    </button>

                  </div>

                  {/* Previous */}
                  <button
                    className="ml-4 w-8 h-8 border border-slate-200 rounded-md flex items-center justify-center hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Today */}
                  <button
                    className="h-8 px-4 border border-slate-200 rounded-md text-xs font-semibold hover:bg-slate-50"
                  >
                    Today
                  </button>

                  {/* Next */}
                  <button
                    className="w-8 h-8 border border-slate-200 rounded-md flex items-center justify-center hover:bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>

              {/* =====================================
                  WEEK CALENDAR
              ====================================== */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">

                {/* Header */}
                <div className="grid grid-cols-[64px_repeat(5,1fr)]">

                  <div className="h-14 bg-slate-50 flex items-center px-4">
                    <span className="text-xs font-semibold text-slate-600">
                      Time
                    </span>
                  </div>

                  {days.map((day) => (
                    <div
                      key={day.date}
                      className={`h-14 border-l border-slate-200 flex flex-col items-center justify-center ${
                        day.today ? 'bg-[#F8FBFF]' : 'bg-white'
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          day.today
                            ? 'text-[#071B38]'
                            : 'text-slate-600'
                        }`}
                      >
                        {day.day} {day.date}
                      </span>

                      {day.today && (
                        <span className="w-1.5 h-1.5 bg-[#071B38] rounded-full mt-1" />
                      )}
                    </div>
                  ))}

                </div>

                {/* Calendar body */}
                <div className="relative">

                  {/* Time rows */}
                  {[
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                  ].map((time) => (
                    <div
                      key={time}
                      className="grid grid-cols-[64px_repeat(5,1fr)] h-[57px]"
                    >

                      {/* Time */}
                      <div className="bg-slate-50 border-t border-slate-200 flex items-start justify-end pr-3 pt-4">
                        <span className="text-xs text-slate-600">
                          {time}
                        </span>
                      </div>

                      {/* Days */}
                      {days.map((day) => (
                        <div
                          key={`${day.date}-${time}`}
                          className={`border-l border-t border-slate-200 ${
                            day.today
                              ? 'bg-[#FCFDFF]'
                              : 'bg-white'
                          }`}
                        />
                      ))}

                    </div>
                  ))}

                  {/* =================================
                      DR. SILVA
                  ================================== */}
                  <div
                    className="
                      absolute
                      left-[17%]
                      top-[61px]
                      w-[84px]
                      h-[88px]
                      rounded-md
                      bg-[#073C78]
                      text-white
                      px-2
                      py-2
                      shadow-sm
                    "
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-semibold text-[11px]">
                        Dr. Silva
                      </span>

                      <span className="w-2 h-2 bg-green-500 rounded-full" />

                    </div>

                    <p className="text-[10px] text-blue-200 mt-1 leading-tight">
                      Thesis
                      <br />
                      Review
                    </p>

                    <p className="text-[9px] text-blue-200 mt-1">
                      09:30 - 10:30
                    </p>

                  </div>

                  {/* =================================
                      PROF. PERERA
                  ================================== */}
                  <div
                    className="
                      absolute
                      left-[37%]
                      top-[351px]
                      w-[87px]
                      h-[60px]
                      rounded-md
                      bg-[#DCE8FA]
                      text-slate-900
                      px-2
                      py-2
                    "
                  >

                    <div className="flex items-start justify-between">

                      <span className="font-bold text-[11px] leading-tight">
                        Prof.
                        <br />
                        Perera
                      </span>

                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-1" />

                    </div>

                    <p className="text-[10px] text-slate-600 mt-1">
                      Project Sync
                    </p>

                  </div>

                  {/* =================================
                      DR. FERNANDO - CONFLICT
                  ================================== */}
                  <div
                    className="
                      absolute
                      left-[57%]
                      top-[419px]
                      w-[87px]
                      h-[120px]
                      rounded-md
                      bg-[#FFD9D7]
                      border-l-4
                      border-red-500
                      px-2
                      py-2
                      text-red-700
                    "
                  >

                    <div className="flex items-start justify-between">

                      <div className="font-bold text-[11px] leading-tight">
                        Dr.
                        <br />
                        Fernando
                      </div>

                      <AlertTriangle className="w-3 h-3 text-red-500 mt-1" />

                    </div>

                    <p className="text-[10px] mt-2 leading-tight">
                      Advising
                      <br />
                      Session
                    </p>

                    <span className="inline-block mt-2 px-1.5 py-1 bg-white/60 rounded text-[9px]">
                      Conflict Detect
                    </span>

                  </div>

                </div>
              </div>

            </section>

            {/* =====================================
                RIGHT SIDE
            ====================================== */}
            <div className="space-y-0">

              {/* =================================
                  REQUEST MEETING
              ================================== */}
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
              >

                <h2 className="text-[20px] font-bold text-slate-900 mb-5">
                  Request Meeting
                </h2>

                {/* Lecturer */}
                <div className="mb-4">

                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Select Lecturer
                  </label>

                  <div className="relative">

                    <select
                      value={selectedLecturer}
                      onChange={(e) =>
                        setSelectedLecturer(e.target.value)
                      }
                      className="
                        w-full
                        h-10
                        appearance-none
                        bg-[#F8FAFC]
                        border
                        border-slate-200
                        rounded-md
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        focus:border-[#071B38]
                      "
                    >
                      <option value="">
                        Choose a faculty member
                      </option>

                      {lecturers.map((lecturer) => (
                        <option
                          key={lecturer}
                          value={lecturer}
                        >
                          {lecturer}
                        </option>
                      ))}

                    </select>

                    <ChevronDown
                      className="
                        absolute
                        right-3
                        top-3
                        w-4
                        h-4
                        text-slate-500
                        pointer-events-none
                      "
                    />

                  </div>
                </div>

                {/* Date */}
                <div className="mb-4">

                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Date
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                      setSelectedDate(e.target.value)
                    }
                    className="
                      w-full
                      h-10
                      bg-[#F8FAFC]
                      border
                      border-slate-200
                      rounded-md
                      px-3
                      text-sm
                      text-slate-700
                      outline-none
                      focus:border-[#071B38]
                    "
                  />

                </div>

                {/* Available Times */}
                <div className="mb-4">

                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Available Times
                  </label>

                  <div className="grid grid-cols-2 gap-2.5">

                    {availableTimes.map((item) => (
                      <button
                        key={item.time}
                        type="button"
                        disabled={!item.available}
                        onClick={() =>
                          setSelectedTime(item.time)
                        }
                        className={`
                          h-9
                          rounded-md
                          border
                          text-xs
                          font-medium
                          transition

                          ${
                            !item.available
                              ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                              : selectedTime === item.time
                              ? 'border-[#071B38] bg-white text-[#071B38] ring-1 ring-[#071B38]'
                              : 'border-slate-200 bg-[#F8FAFC] text-slate-600 hover:border-[#071B38]'
                          }
                        `}
                      >
                        {item.time}
                      </button>
                    ))}

                  </div>

                </div>

                {/* Topic */}
                <div className="mb-5">

                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Topic / Notes
                  </label>

                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) =>
                      setNotes(e.target.value)
                    }
                    placeholder="Briefly describe the purpose of the meeting..."
                    className="
                      w-full
                      resize-none
                      bg-[#F8FAFC]
                      border
                      border-slate-200
                      rounded-md
                      px-3
                      py-3
                      text-sm
                      text-slate-700
                      placeholder:text-slate-400
                      outline-none
                      focus:border-[#071B38]
                    "
                  />

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    w-full
                    h-9
                    bg-[#05264A]
                    hover:bg-[#0A315C]
                    text-white
                    rounded-md
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-xs
                    font-semibold
                    transition
                  "
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Request
                </button>

              </form>

              {/* =================================
                  STATUS LEGEND
              ================================== */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
                  Status Legend
                </h3>

                <div className="space-y-3">

                  {/* Confirmed */}
                  <div className="flex items-center gap-3">

                    <span className="w-3 h-3 rounded-full bg-green-500" />

                    <span className="text-sm text-slate-700">
                      Confirmed
                    </span>

                  </div>

                  {/* Pending */}
                  <div className="flex items-center gap-3">

                    <span className="w-3 h-3 rounded-full bg-amber-500" />

                    <span className="text-sm text-slate-700">
                      Pending Approval
                    </span>

                  </div>

                  {/* Conflict */}
                  <div className="flex items-center gap-3">

                    <span className="w-1 h-4 rounded-sm bg-red-500" />

                    <span className="text-sm text-slate-700">
                      Conflict / Action Req.
                    </span>

                  </div>

                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default MeetingScheduler;