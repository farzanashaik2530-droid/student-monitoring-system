
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Mail, Phone, MapPin, User, BookOpen, Clock, BarChart2, Star, Sparkles, Loader2, GraduationCap, ShieldCheck } from 'lucide-react';
import { Student } from '../types';
import { geminiService } from '../services/geminiService';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const text = await geminiService.getPerformanceInsights(student);
      setInsight(text);
      setLoadingInsight(false);
    };
    fetchInsight();
  }, [student]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
        <ChevronLeft size={20} /> Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info (No Image) */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <div className="mb-6 mx-auto w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-3xl border-2 border-indigo-100 shadow-inner">
               {getInitials(student.name)}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{student.name}</h2>
            <p className="text-slate-400 mb-8 font-mono font-medium tracking-widest uppercase text-xs">Roll: {student.rollNumber}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                <p className="text-[10px] text-indigo-500 font-black uppercase mb-1 tracking-widest">GPA</p>
                <p className="text-2xl font-black text-indigo-700">{student.gpa}</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
                <p className="text-[10px] text-emerald-500 font-black uppercase mb-1 tracking-widest">Attendance</p>
                <p className="text-2xl font-black text-emerald-700">{student.attendancePercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 pb-2 border-b border-slate-50">Academic Context</h3>
            <DetailItem icon={<GraduationCap size={18} />} label="Year & Branch" value={`${student.grade} - ${student.section}`} />
            <DetailItem icon={<Mail size={18} />} label="University Email" value={student.email} />
            <DetailItem icon={<Phone size={18} />} label="Student Contact" value={student.studentPhone} />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 pb-2 border-b border-slate-50">Guardian Contact</h3>
            <DetailItem icon={<User size={18} />} label="Emergency Contact" value={student.parentName} />
            <DetailItem icon={<Phone size={18} />} label="Guardian Phone" value={student.parentPhone} />
            <DetailItem icon={<MapPin size={18} />} label="Permanent Address" value="Campus Quarters, Block B" />
          </div>
        </div>

        {/* Right Column: Academic & AI Insights */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Insights Section */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={120} />
            </div>
            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> AI Performance Analysis
            </div>
            {loadingInsight ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="animate-spin" size={20} />
                <p className="text-indigo-100 italic">Synthesizing engineering records...</p>
              </div>
            ) : (
              <p className="text-xl leading-relaxed font-medium">
                "{insight}"
              </p>
            )}
            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">Semester Summary</button>
              <button className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all">Download Records</button>
            </div>
          </div>

          {/* Academic Results Table */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <BarChart2 className="text-indigo-600" size={20} />
                </div>
                Course performance
              </h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Semester IV (Active)</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {student.academicDetails.map((subject, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subject</p>
                      <span className="text-sm font-bold text-slate-800">{subject.subject}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-indigo-600">{subject.score}/100</span>
                      <p className="text-[10px] font-bold text-slate-400">Grade: {subject.grade}</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${subject.score > 90 ? 'bg-indigo-500' : subject.score > 80 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                      style={{ width: `${subject.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-8 flex items-center gap-3">
               <div className="p-2 bg-indigo-50 rounded-lg">
                <Clock className="text-indigo-600" size={20} />
               </div>
              Academic Timeline
            </h3>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <ActivityItem icon={<CheckCircleIcon />} date="Today" activity="Internal Lab Assessment" status="Grade Uploaded: O" />
              <ActivityItem icon={<AlertCircleIcon />} date="Yesterday" activity="Absent for DBMS Lecture" status="Dual Alert Triggered (P+S)" highlight />
              <ActivityItem icon={<StarIcon />} date="3 days ago" activity="Hackathon Shortlisting" status="Qualified for Finals" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon, date, activity, status, highlight = false }: { icon: React.ReactNode, date: string, activity: string, status: string, highlight?: boolean }) => (
  <div className="flex items-start gap-6 relative z-10">
    <div className={`p-2 rounded-xl border shadow-sm ${highlight ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-white text-slate-400 border-slate-100'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <p className={`text-sm font-black uppercase tracking-tight ${highlight ? 'text-rose-600' : 'text-slate-800'}`}>{activity}</p>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{date}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{status}</p>
    </div>
  </div>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default StudentProfile;
