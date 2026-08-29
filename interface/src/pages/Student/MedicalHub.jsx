import React, { useState } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';

import {
  FilePlus2,
  ClipboardList,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  History,
  UploadCloud,
  XCircle,
} from 'lucide-react';

const MedicalHub = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason || !file) {
      alert('Please complete the required fields and upload your medical certificate.');
      return;
    }

    console.log({
      startDate,
      endDate,
      reason,
      details,
      file,
    });

    alert('Medical submission submitted successfully.');

    setStartDate('');
    setEndDate('');
    setReason('');
    setDetails('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* SIDE NAVBAR */}
      <Sidenavbar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP NAVBAR */}
        <Topnavbar />

        {/* PAGE CONTENT */}
        <main className="p-8 max-w-[1400px] w-full mx-auto">

          {/* PAGE HEADER */}
          <div className="mb-6">
            <h1 className="text-[26px] font-bold text-slate-900">
              Medical Submission Hub
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Submit and track your medical certificates for approved absences.
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_330px] gap-6 items-start">

            {/* =========================================
                NEW SUBMISSION
            ========================================== */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-2 mb-5">
                <FilePlus2 className="w-4 h-4 text-[#05264A]" />

                <h2 className="text-[16px] font-bold text-slate-900">
                  New Submission
                </h2>
              </div>

              <form onSubmit={handleSubmit}>

                {/* DATES */}
                <div className="grid grid-cols-2 gap-3 mb-4">

                  <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="
                        w-full
                        h-10
                        bg-[#F8FAFC]
                        border border-slate-200
                        rounded-md
                        px-3
                        text-xs
                        text-slate-700
                        outline-none
                        focus:border-[#071B38]
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="
                        w-full
                        h-10
                        bg-[#F8FAFC]
                        border border-slate-200
                        rounded-md
                        px-3
                        text-xs
                        text-slate-700
                        outline-none
                        focus:border-[#071B38]
                      "
                    />
                  </div>

                </div>

                {/* REASON */}
                <div className="mb-4">

                  <label className="block text-[9px] font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                    Reason for Absence
                  </label>

                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="
                      w-full
                      h-10
                      appearance-none
                      bg-[#F8FAFC]
                      border border-slate-200
                      rounded-md
                      px-3
                      text-xs
                      text-slate-700
                      outline-none
                      focus:border-[#071B38]
                    "
                  >
                    <option value="">
                      Select reason...
                    </option>

                    <option value="General Illness">
                      General Illness
                    </option>

                    <option value="Surgery/Procedure">
                      Surgery / Procedure
                    </option>

                    <option value="Medical Appointment">
                      Medical Appointment
                    </option>

                    <option value="Hospitalization">
                      Hospitalization
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

                {/* ADDITIONAL DETAILS */}
                <div className="mb-4">

                  <label className="block text-[9px] font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                    Additional Details (Optional)
                  </label>

                  <textarea
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide any necessary context..."
                    className="
                      w-full
                      resize-none
                      bg-[#F8FAFC]
                      border border-slate-200
                      rounded-md
                      px-3
                      py-3
                      text-xs
                      text-slate-700
                      placeholder:text-slate-400
                      outline-none
                      focus:border-[#071B38]
                    "
                  />

                </div>

                {/* FILE UPLOAD */}
                <div className="mb-5">

                  <label className="block text-[9px] font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                    Upload Medical Certificate
                  </label>

                  <label
                    className="
                      block
                      border-2
                      border-dashed
                      border-slate-300
                      rounded-md
                      bg-[#F8FAFC]
                      hover:bg-slate-50
                      cursor-pointer
                      transition
                    "
                  >

                    <div className="h-[76px] flex flex-col items-center justify-center">

                      <UploadCloud className="w-5 h-5 text-slate-500 mb-1" />

                      {file ? (
                        <>
                          <p className="text-[10px] font-semibold text-[#05264A]">
                            {file.name}
                          </p>

                          <p className="text-[9px] text-slate-400 mt-0.5">
                            Click to replace file
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[10px] text-slate-700">
                            <span className="font-semibold">
                              Drag and drop file here
                            </span>{' '}
                            or browse
                          </p>

                          <p className="text-[9px] text-slate-500 mt-1">
                            Supported formats: PDF, JPG, PNG (Max 5MB)
                          </p>
                        </>
                      )}

                    </div>

                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                  </label>

                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setReason('');
                      setDetails('');
                      setFile(null);
                    }}
                    className="
                      h-9
                      px-5
                      border border-slate-200
                      bg-white
                      hover:bg-slate-50
                      text-slate-600
                      rounded-md
                      text-[10px]
                      font-semibold
                    "
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    className="
                      h-9
                      px-5
                      bg-[#05264A]
                      hover:bg-[#0A315C]
                      text-white
                      rounded-md
                      text-[10px]
                      font-semibold
                    "
                  >
                    SUBMIT MEDICAL
                  </button>

                </div>

              </form>

            </section>

            {/* =========================================
                RIGHT COLUMN
            ========================================== */}
            <div className="space-y-4">

              {/* ACTIVE REVIEW STATUS */}
              <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

                <div className="flex items-center gap-2 mb-4">

                  <ClipboardList className="w-4 h-4 text-orange-500" />

                  <h2 className="text-[15px] font-bold text-slate-900">
                    Active Review Status
                  </h2>

                </div>

                <div className="relative">

                  {/* VERTICAL LINE */}
                  <div className="absolute left-[10px] top-3 bottom-3 w-px bg-slate-200" />

                  {/* LECTURER REVIEW */}
                  <div className="relative flex gap-3 mb-4">

                    <div className="relative z-10 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md p-2.5">

                      <div className="flex items-center justify-between">

                        <span className="text-[9px] font-bold text-slate-700">
                          LECTURER REVIEW
                        </span>

                        <span className="text-[7px] px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-semibold">
                          Approved
                        </span>

                      </div>

                      <p className="text-[9px] text-slate-500 mt-1">
                        Reviewed by Dr. A. Perera on Oct 12, 2023
                      </p>

                    </div>

                  </div>

                  {/* HOD REVIEW */}
                  <div className="relative flex gap-3 mb-4">

                    <div className="relative z-10 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                      <Clock3 className="w-3 h-3 text-white" />
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md p-2.5">

                      <div className="flex items-center justify-between">

                        <span className="text-[9px] font-bold text-slate-700">
                          HOD REVIEW
                        </span>

                        <span className="text-[7px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-500 font-semibold">
                          Pending
                        </span>

                      </div>

                      <p className="text-[9px] text-slate-500 mt-1">
                        Awaiting review from Head of Department.
                      </p>

                    </div>

                  </div>

                  {/* DEAN APPROVAL */}
                  <div className="relative flex gap-3">

                    <div className="relative z-10 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <LockKeyhole className="w-3 h-3 text-slate-400" />
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md p-2.5">

                      <div className="flex items-center justify-between">

                        <span className="text-[9px] font-bold text-slate-700">
                          DEAN APPROVAL
                        </span>

                        <span className="text-[7px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-semibold">
                          Queued
                        </span>

                      </div>

                      <p className="text-[9px] text-slate-500 mt-1">
                        Final approval stage.
                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* =========================================
                  PAST SUBMISSIONS
              ========================================== */}
              <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

                <div className="flex items-center gap-2 mb-4">

                  <History className="w-4 h-4 text-slate-700" />

                  <h2 className="text-[15px] font-bold text-slate-900">
                    Past Submissions
                  </h2>

                </div>

                <div className="space-y-3">

                  {/* SUBMISSION 1 */}
                  <div className="flex items-center gap-3">

                    <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </div>

                    <div className="flex-1">

                      <p className="text-[9px] font-semibold text-slate-700">
                        Sep 01 - Sep 03, 2023
                      </p>

                      <p className="text-[8px] text-slate-500">
                        General Illness
                      </p>

                    </div>

                    <span className="text-[7px] px-2 py-1 rounded-full bg-green-50 text-green-500 font-semibold">
                      APPROVED
                    </span>

                  </div>

                  {/* SUBMISSION 2 */}
                  <div className="flex items-center gap-3">

                    <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center">
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                    </div>

                    <div className="flex-1">

                      <p className="text-[9px] font-semibold text-slate-700">
                        Jul 15 - Jul 15, 2023
                      </p>

                      <p className="text-[8px] text-slate-500">
                        Missing Documentation
                      </p>

                    </div>

                    <span className="text-[7px] px-2 py-1 rounded-full bg-red-50 text-red-500 font-semibold">
                      REJECTED
                    </span>

                  </div>

                  {/* SUBMISSION 3 */}
                  <div className="flex items-center gap-3">

                    <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </div>

                    <div className="flex-1">

                      <p className="text-[9px] font-semibold text-slate-700">
                        Mar 10 - Mar 14, 2023
                      </p>

                      <p className="text-[8px] text-slate-500">
                        Surgery/Procedure
                      </p>

                    </div>

                    <span className="text-[7px] px-2 py-1 rounded-full bg-green-50 text-green-500 font-semibold">
                      APPROVED
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="
                    w-full
                    mt-5
                    text-[8px]
                    font-bold
                    text-[#05264A]
                    hover:underline
                  "
                >
                  VIEW ALL HISTORY
                </button>

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default MedicalHub;