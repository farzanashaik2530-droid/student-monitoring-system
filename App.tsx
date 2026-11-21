
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  CalendarCheck, 
  Bell, 
  Search, 
  LogOut, 
  TrendingUp, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  X,
  History,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Student, ViewState, NotificationLog } from './types';
import { MOCK_STUDENTS } from "./components/constants";
import Dashboard from './components/Dashboard';
import AttendanceTracker from './components/AttendanceTracker';
import StudentList from './components/StudentList';
import StudentProfile from './components/StudentProfile';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | null>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: null }), {})
  );
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const activeStudent = students.find(s => s.id === selectedStudentId);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setView('profile');
  };

  const addNotification = (log: NotificationLog) => {
    setNotifications(prev => [log, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-30`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            EG
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-indigo-900">EduGuard</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<CalendarCheck size={20} />} 
            label="Attendance" 
            active={view === 'attendance'} 
            onClick={() => setView('attendance')}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Students" 
            active={view === 'students'} 
            onClick={() => setView('students')}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={() => setSidebarOpen(!isSidebarOpen)}
             className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-slate-500"
           >
             <ChevronRight className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} size={20} />
             {isSidebarOpen && <span>Minimize Sidebar</span>}
           </button>
           <button className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg mt-2">
             <LogOut size={20} />
             {isSidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">{view}</h1>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setNotifDrawerOpen(true)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Dr. K. Sampath</p>
                <p className="text-xs text-slate-500">Class Mentor</p>
              </div>
              <img src="https://picsum.photos/seed/admin/100/100" className="w-9 h-9 rounded-full ring-2 ring-indigo-100" alt="Admin" />
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-8">
          {view === 'dashboard' && <Dashboard students={students} onSelectStudent={handleSelectStudent} notifications={notifications} />}
          {view === 'attendance' && (
            <AttendanceTracker 
              students={students} 
              onNotify={addNotification} 
              attendanceState={attendance} 
              setAttendanceState={setAttendance}
            />
          )}
          {view === 'students' && <StudentList students={students} onSelectStudent={handleSelectStudent} />}
          {view === 'profile' && activeStudent && (
            <StudentProfile 
              student={activeStudent} 
              onBack={() => setView('students')} 
            />
          )}
        </div>

        {/* Notification Drawer (Sidebar Overlay) */}
        {isNotifDrawerOpen && (
          <>
            <div 
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 animate-in fade-in duration-300" 
              onClick={() => setNotifDrawerOpen(false)}
            ></div>
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-500 border-l border-slate-200 flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-indigo-600" />
                  <h2 className="font-bold text-lg text-slate-800">SMS Transmission Log</h2>
                </div>
                <button onClick={() => setNotifDrawerOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <MessageSquare size={48} className="mb-4 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">No transmissions recorded</p>
                    <p className="text-xs text-slate-400 mt-2">Messages sent to parents and students will appear here for verification.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-all shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            notif.recipient === 'parent' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {notif.recipient}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> SENT
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                         <Phone size={14} className="text-slate-400" />
                         <span className="text-sm font-mono font-bold text-slate-700">{notif.phone}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border-l-4 border-slate-300">
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{notif.message}"</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-indigo-50/30">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1">Gateway Status</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-bold text-emerald-600">Active - Secure Multi-Channel SMS</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
      active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
      : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

export default App;
