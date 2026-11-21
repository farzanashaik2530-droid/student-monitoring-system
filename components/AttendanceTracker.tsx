
import React, { useState } from 'react';
import { Check, X, AlertCircle, Loader2, Phone, MessageSquare, Users, Smartphone, ShieldCheck, GraduationCap } from 'lucide-react';
import { Student, NotificationLog } from '../types';
import { geminiService } from '../services/geminiService';

interface AttendanceTrackerProps {
  students: Student[];
  onNotify: (log: NotificationLog) => void;
  attendanceState: Record<string, 'present' | 'absent' | 'late' | null>;
  setAttendanceState: React.Dispatch<React.SetStateAction<Record<string, 'present' | 'absent' | 'late' | null>>>;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ students, onNotify, attendanceState, setAttendanceState }) => {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [date] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    // Set status immediately in global state
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));

    // If marked absent, trigger dual AI message generation (Parent + Student)
    if (status === 'absent') {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      setLoadingIds(prev => new Set(prev).add(studentId));
      
      try {
        // Generate messages for both parties using Gemini
        const [parentMessage, studentMessage] = await Promise.all([
          geminiService.generateAbsenceMessage(student, 'parent'),
          geminiService.generateAbsenceMessage(student, 'student')
        ]);
        
        // Simulate real-time transmission delay
        setTimeout(() => {
          // Send to Parent
          onNotify({
            id: `p-${Math.random().toString(36).substr(2, 9)}`,
            studentId,
            recipient: 'parent',
            phone: student.parentPhone,
            message: parentMessage,
            timestamp: new Date(),
            status: 'sent'
          });

          // Send to Student
          onNotify({
            id: `s-${Math.random().toString(36).substr(2, 9)}`,
            studentId,
            recipient: 'student',
            phone: student.studentPhone,
            message: studentMessage,
            timestamp: new Date(),
            status: 'sent'
          });

          setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(studentId);
            return next;
          });
        }, 2000);
      } catch (error) {
        console.error("Dual notification failed", error);
        setLoadingIds(prev => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
      }
    }
  };

  const stats = {
    present: Object.values(attendanceState).filter(v => v === 'present').length,
    absent: Object.values(attendanceState).filter(v => v === 'absent').length,
    late: Object.values(attendanceState).filter(v => v === 'late').length,
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance Monitoring</h2>
          <p className="text-slate-500">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge color="emerald" count={stats.present} label="Present" pulse />
          <Badge color="rose" count={stats.absent} label="Absent" />
          <Badge color="amber" count={stats.late} label="Late" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Summary</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Gateway Numbers</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Mark Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-none mb-1">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tight">{student.rollNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center bg-slate-100/50 px-3 py-1 rounded-lg border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">GPA</p>
                       <p className="text-sm font-bold text-indigo-600">{student.gpa}</p>
                    </div>
                    <div className="text-center bg-slate-100/50 px-3 py-1 rounded-lg border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Attend</p>
                       <p className="text-sm font-bold text-slate-700">{student.attendancePercentage}%</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-black uppercase tracking-tight">Parent</span>
                      <span className="text-xs font-mono font-medium text-slate-600">{student.parentPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-black uppercase tracking-tight">Student</span>
                      <span className="text-xs font-mono font-medium text-slate-600">{student.studentPhone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <AttendanceButton 
                      active={attendanceState[student.id] === 'present'} 
                      color="emerald" 
                      onClick={() => markAttendance(student.id, 'present')}
                      icon={<Check size={18} />}
                      label="Mark Present"
                    />
                    <AttendanceButton 
                      active={attendanceState[student.id] === 'absent'} 
                      color="rose" 
                      onClick={() => markAttendance(student.id, 'absent')}
                      icon={loadingIds.has(student.id) ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
                      label="Mark Absent & Trigger Dual SMS"
                      disabled={loadingIds.has(student.id)}
                    />
                    <AttendanceButton 
                      active={attendanceState[student.id] === 'late'} 
                      color="amber" 
                      onClick={() => markAttendance(student.id, 'late')}
                      icon={<ClockIcon size={18} />}
                      label="Mark Late"
                    />
                  </div>
                  {loadingIds.has(student.id) ? (
                    <div className="mt-2 text-center animate-pulse">
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Transmitting to Mobile...</span>
                    </div>
                  ) : attendanceState[student.id] === 'absent' && (
                    <div className="mt-2 text-center">
                      <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">
                        <Smartphone size={10} /> Dual SMS Delivered
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <ShieldCheck size={120} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-900/50">
            <Smartphone className="text-white" size={32} />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-1">Dual-Channel Verification</h3>
            <p className="text-slate-400 text-sm max-w-md">The system automatically generates personalized academic summaries and transmits them to both Parent and Student mobiles upon marking an absence.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0 relative z-10">
           <div className="text-right hidden sm:block mr-2">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Gateway Load</p>
              <p className="text-sm font-bold text-white tracking-tight">Optimal Performance</p>
           </div>
           <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
            Download Log Report
          </button>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ color, count, label, pulse = false }: { color: string, count: number, label: string, pulse?: boolean }) => {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  const dotColor: Record<string, string> = {
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className={`flex items-center gap-2 px-5 py-2.5 border rounded-2xl text-sm font-black uppercase tracking-tight ${styles[color]}`}>
      <div className={`w-2 h-2 ${dotColor[color]} rounded-full ${pulse ? 'animate-pulse ring-4 ring-emerald-500/20' : ''}`}></div>
      {count} {label}
    </div>
  );
};

interface AttendanceButtonProps {
  active: boolean;
  color: 'emerald' | 'rose' | 'amber';
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const AttendanceButton: React.FC<AttendanceButtonProps> = ({ active, color, onClick, icon, label, disabled }) => {
  const colors = {
    emerald: active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600',
    rose: active ? 'bg-rose-600 text-white shadow-lg shadow-rose-100 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600',
    amber: active ? 'bg-amber-500 text-white shadow-lg shadow-amber-100 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500',
  };

  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all flex items-center gap-2 border border-transparent ${colors[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-90'}`}
      title={label}
    >
      {icon}
    </button>
  );
};

const ClockIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default AttendanceTracker;
