
import React from 'react';
import { Users, Smartphone, ShieldCheck, History } from 'lucide-react';
import { Student, NotificationLog } from '../types';

interface DashboardProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
  notifications: NotificationLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, onSelectStudent, notifications }) => {
  const totalStudents = students.length;
  const recentNotifs = notifications.slice(0, 4);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-700 max-w-6xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Count Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-sm group hover:border-indigo-200 transition-all flex flex-col items-center gap-6 text-center h-full justify-center">
          <div className="p-10 bg-indigo-50 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 duration-500">
            <Users size={64} />
          </div>
          <div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs mb-3">Monitoring Directory</p>
            <h3 className="text-7xl font-black text-slate-900 tracking-tighter">{totalStudents}</h3>
          </div>
          <div className="mt-4 px-6 py-2 bg-indigo-50/50 rounded-full text-xs font-black text-indigo-500 uppercase tracking-widest border border-indigo-100">
            B.Tech II Year - CSM-A
          </div>
        </div>

        {/* SMS Transmission Summary */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <History size={20} className="text-indigo-600" />
               <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Transmission History</h3>
             </div>
             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">Live Feed</span>
           </div>

           <div className="flex-1 space-y-3">
             {recentNotifs.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                 <Smartphone size={40} className="mb-2 text-slate-300" />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Alerts Sent Today</p>
               </div>
             ) : (
               recentNotifs.map((n, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className={`p-2 rounded-xl ${n.recipient === 'parent' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Smartphone size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">SMS to {n.recipient === 'parent' ? 'Guardian' : 'Student'}</p>
                      <p className="text-[10px] font-mono font-medium text-slate-500">{n.phone}</p>
                    </div>
                    <div className="text-[9px] font-bold text-emerald-600 bg-white px-2 py-1 rounded-md border border-emerald-100">
                      SUCCESS
                    </div>
                 </div>
               ))
             )}
           </div>

           {notifications.length > 0 && (
             <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">
               View All Transmissions ({notifications.length})
             </button>
           )}
        </div>
      </div>

      {/* Helper Context */}
      <div className="w-full p-8 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
        <div className="absolute -left-10 -bottom-10 opacity-10">
           <ShieldCheck size={200} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Smartphone size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black mb-1">Fail-Safe Alert System</h4>
            <p className="text-indigo-100 text-sm opacity-80 max-w-lg">Every absence mark triggers a verified dual-SMS relay. Parents and students are notified simultaneously to ensure maximum attendance accountability.</p>
          </div>
        </div>
        <div className="relative z-10">
           <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Gateway Health</span>
             </div>
             <p className="text-lg font-black italic">100% RELIABILITY</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
