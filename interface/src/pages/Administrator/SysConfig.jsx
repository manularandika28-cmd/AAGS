import React, { useState, useEffect } from 'react';
import Sidenavbar from '../../components/Sidenavbar';
import Topnavbar from '../../components/Topnavbar';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  CalendarDays,
  BriefcaseMedical,
  ShieldCheck,
  BellRing,
  Settings,
  Save,
  RotateCcw,
  Clock,
  FileText,
  Database,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const SystemConfiguration = () => {
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState({
    academicYear: '2026',
    semester: 'Semester 2',
    minimumAttendance: '80',
    warningAttendance: '85',
    maximumLeave: '4',

    meetingDuration: '30',
    bookingNotice: '2',
    advanceBooking: '30',
    meetingReminder: '24',

    medicalExpiryReminder: '30',
    maxFileSize: '10',
    requireVerification: true,

    sessionTimeout: '30',
    maxLoginAttempts: '5',
    lockoutDuration: '15',
    mfaAdmins: true,

    emailNotifications: true,
    meetingNotifications: true,
    attendanceNotifications: true,
    medicalNotifications: true,

    systemName: 'Faculty Student Management System',
    timezone: 'Asia/Colombo',
    dateFormat: 'DD/MM/YYYY',
    maintenanceMode: false
  });

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('academic');

  useEffect(() => {
  const loadConfiguration = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/admin/system-configuration',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load system configuration');
      }

      const data = await response.json();

      setSettings(data);
    } catch (error) {
      console.error('Error loading system configuration:', error);
    }
  };

  loadConfiguration();
}, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));

    setSaved(false);
  };

  const handleSave = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/system-configuration',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(settings)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save system configuration');
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  } catch (error) {
    console.error('Error saving system configuration:', error);
  }
};

 const handleReset = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/system-configuration',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reload system configuration');
    }

    const data = await response.json();

    setSettings(data);
    setSaved(false);
  } catch (error) {
    console.error('Error resetting system configuration:', error);
  }
};

  const Toggle = ({ enabled, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          enabled ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    );
  };

  const InputField = ({
    label,
    value,
    onChange,
    type = 'text',
    suffix
  }) => {
    return (
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1">
          {label}
        </label>

        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              suffix ? 'pr-14' : ''
            }`}
          />

          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  const SelectField = ({
    label,
    value,
    onChange,
    children
  }) => {
    return (
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1">
          {label}
        </label>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {children}
        </select>
      </div>
    );
  };

  const ToggleRow = ({
    title,
    description,
    enabled,
    onChange
  }) => {
    return (
      <div className="flex items-center justify-between gap-5 py-3.5 border-b border-slate-100 last:border-b-0">
        <div>
          <p className="text-xs font-bold text-slate-800">
            {title}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            {description}
          </p>
        </div>

        <Toggle
          enabled={enabled}
          onChange={onChange}
        />
      </div>
    );
  };

  const configurationItems = [
    {
      id: 'academic',
      label: 'Academic',
      icon: GraduationCap
    },
    {
      id: 'meetings',
      label: 'Meetings',
      icon: CalendarDays
    },
    {
      id: 'medical',
      label: 'Medical',
      icon: BriefcaseMedical
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellRing
    },
    {
      id: 'general',
      label: 'General',
      icon: Settings
    }
  ];

  const renderAcademicConfiguration = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Academic Configuration
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Attendance and academic rules
            </p>
          </div>
        </div>

        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-3 py-1.5 rounded-md">
          ACADEMIC
        </span>
      </div>

      <div className="pt-5 space-y-6">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Attendance Rules
          </p>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Minimum Attendance"
              value={settings.minimumAttendance}
              suffix="%"
              onChange={(value) =>
                handleChange('minimumAttendance', value)
              }
              type="number"
            />

            <InputField
              label="Warning Threshold"
              value={settings.warningAttendance}
              suffix="%"
              onChange={(value) =>
                handleChange('warningAttendance', value)
              }
              type="number"
            />

            <InputField
              label="Maximum Allowed Leave"
              value={settings.maximumLeave}
              suffix="DAYS"
              onChange={(value) =>
                handleChange('maximumLeave', value)
              }
              type="number"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Academic Period
          </p>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Academic Year"
              value={settings.academicYear}
              onChange={(value) =>
                handleChange('academicYear', value)
              }
            >
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </SelectField>

            <SelectField
              label="Semester"
              value={settings.semester}
              onChange={(value) =>
                handleChange('semester', value)
              }
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </SelectField>
          </div>
        </div>

      </div>
    </>
  );

  const renderMeetingConfiguration = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Meeting Configuration
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Configure student meeting and booking rules.
            </p>
          </div>
        </div>

        <Clock className="w-5 h-5 text-slate-300" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-5">
        <InputField
          label="Meeting Duration"
          value={settings.meetingDuration}
          suffix="MIN"
          onChange={(value) =>
            handleChange('meetingDuration', value)
          }
          type="number"
        />

        <InputField
          label="Minimum Booking Notice"
          value={settings.bookingNotice}
          suffix="HOURS"
          onChange={(value) =>
            handleChange('bookingNotice', value)
          }
          type="number"
        />

        <InputField
          label="Maximum Advance Booking"
          value={settings.advanceBooking}
          suffix="DAYS"
          onChange={(value) =>
            handleChange('advanceBooking', value)
          }
          type="number"
        />

        <InputField
          label="Meeting Reminder"
          value={settings.meetingReminder}
          suffix="HOURS"
          onChange={(value) =>
            handleChange('meetingReminder', value)
          }
          type="number"
        />
      </div>
    </>
  );

  const renderMedicalConfiguration = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BriefcaseMedical className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Medical Hub
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Manage medical document and verification rules.
            </p>
          </div>
        </div>

        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-md">
          MEDICAL
        </span>
      </div>

      <div className="pt-3">
        <ToggleRow
          title="Require Document Verification"
          description="Medical documents must be reviewed by authorized staff."
          enabled={settings.requireVerification}
          onChange={(value) =>
            handleChange('requireVerification', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3">
        <InputField
          label="Expiry Reminder"
          value={settings.medicalExpiryReminder}
          suffix="DAYS"
          onChange={(value) =>
            handleChange('medicalExpiryReminder', value)
          }
          type="number"
        />

        <InputField
          label="Maximum File Size"
          value={settings.maxFileSize}
          suffix="MB"
          onChange={(value) =>
            handleChange('maxFileSize', value)
          }
          type="number"
        />
      </div>

      <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-start gap-3">
        <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />

        <div>
          <p className="text-xs font-bold text-slate-700">
            Supported document formats
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            PDF, JPG and PNG files are accepted.
          </p>
        </div>
      </div>
    </>
  );

  const renderSecurityConfiguration = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Security Configuration
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Configure authentication and account security.
            </p>
          </div>
        </div>

        <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-3 py-1.5 rounded-md">
          SECURITY
        </span>
      </div>

      <div className="pt-3">
        <ToggleRow
          title="MFA Required for Administrators"
          description="Require multi-factor authentication for system administrators."
          enabled={settings.mfaAdmins}
          onChange={(value) =>
            handleChange('mfaAdmins', value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3">
        <InputField
          label="Session Timeout"
          value={settings.sessionTimeout}
          suffix="MIN"
          onChange={(value) =>
            handleChange('sessionTimeout', value)
          }
          type="number"
        />

        <InputField
          label="Maximum Login Attempts"
          value={settings.maxLoginAttempts}
          suffix="TRIES"
          onChange={(value) =>
            handleChange('maxLoginAttempts', value)
          }
          type="number"
        />

        <InputField
          label="Account Lockout"
          value={settings.lockoutDuration}
          suffix="MIN"
          onChange={(value) =>
            handleChange('lockoutDuration', value)
          }
          type="number"
        />
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />

        <div>
          <p className="text-xs font-bold text-amber-700">
            Security changes are logged
          </p>

          <p className="text-[11px] text-amber-600 mt-1">
            Changes to security settings will be recorded in Audit Logs.
          </p>
        </div>
      </div>
    </>
  );

  const renderNotificationConfiguration = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Notifications
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Control system-wide notification services.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <ToggleRow
          title="Email Notifications"
          description="Enable email-based system notifications."
          enabled={settings.emailNotifications}
          onChange={(value) =>
            handleChange('emailNotifications', value)
          }
        />

        <ToggleRow
          title="Meeting Notifications"
          description="Send reminders and meeting status updates."
          enabled={settings.meetingNotifications}
          onChange={(value) =>
            handleChange('meetingNotifications', value)
          }
        />

        <ToggleRow
          title="Attendance Warnings"
          description="Notify students when attendance falls below the warning threshold."
          enabled={settings.attendanceNotifications}
          onChange={(value) =>
            handleChange('attendanceNotifications', value)
          }
        />

        <ToggleRow
          title="Medical Expiry Alerts"
          description="Notify students before medical documents expire."
          enabled={settings.medicalNotifications}
          onChange={(value) =>
            handleChange('medicalNotifications', value)
          }
        />
      </div>
    </>
  );

  const renderGeneralConfiguration = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              General System Settings
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Configure general application preferences.
            </p>
          </div>
        </div>

        <Database className="w-5 h-5 text-slate-300" />
      </div>

      <div className="space-y-4 pt-5">
        <InputField
          label="System Name"
          value={settings.systemName}
          onChange={(value) =>
            handleChange('systemName', value)
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Time Zone"
            value={settings.timezone}
            onChange={(value) =>
              handleChange('timezone', value)
            }
          >
            <option value="Asia/Colombo">Asia/Colombo</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="UTC">UTC</option>
          </SelectField>

          <SelectField
            label="Date Format"
            value={settings.dateFormat}
            onChange={(value) =>
              handleChange('dateFormat', value)
            }
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </SelectField>
        </div>

        <ToggleRow
          title="Maintenance Mode"
          description="Temporarily restrict access while system maintenance is performed."
          enabled={settings.maintenanceMode}
          onChange={(value) =>
            handleChange('maintenanceMode', value)
          }
        />
      </div>
    </>
  );

  const renderActiveConfiguration = () => {
    switch (activeSection) {
      case 'academic':
        return renderAcademicConfiguration();

      case 'meetings':
        return renderMeetingConfiguration();

      case 'medical':
        return renderMedicalConfiguration();

      case 'security':
        return renderSecurityConfiguration();

      case 'notifications':
        return renderNotificationConfiguration();

      case 'general':
        return renderGeneralConfiguration();

      default:
        return renderAcademicConfiguration();
    }
  };

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased">

      <Sidenavbar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">

          {/* Page Header */}
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 text-white tracking-tight">
                System Configuration
              </h1>

              <p className="text-sm text-slate-500 text-white mt-1 font-medium">
                Configure global system settings, policies, and operational rules.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 bg-white hover:bg-[#f4cccc] text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-white hover:bg-[#9fb6d4] text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>

            </div>
          </div>

          {/* Save Success Message */}
          {saved && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3.5 flex items-center gap-3">

              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />

              <div>
                <p className="text-xs font-bold text-emerald-700">
                  Configuration saved successfully
                </p>

                <p className="text-[11px] text-emerald-600 mt-1">
                  Your system configuration changes have been applied.
                </p>
              </div>

            </div>
          )}

          {/* Configuration Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">

            {/* Configuration Navigation */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

              <div className="pb-4 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Configuration
                </p>
              </div>

              <div className="pt-4 space-y-1">

                {configurationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-400'
                        }`}
                      />

                      <span className="text-xs font-bold">
                        {item.label}
                      </span>
                    </button>
                  );
                })}

              </div>

            </section>

            {/* Active Configuration */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

              {renderActiveConfiguration()}

            </section>

          </div>

        </main>

      </div>

    </div>
  );
};

export default SystemConfiguration;

