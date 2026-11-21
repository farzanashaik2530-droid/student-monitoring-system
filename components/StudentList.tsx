
import React from 'react';
import { Search, Filter, MoreVertical, GraduationCap, Mail, Phone, User } from 'lucide-react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
          <p className="text-slate-500">Managing {students.length} students in B.Tech II Year - CSM-A</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            Add New Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => (
          <div 
            key={student.id}
            onClick={() => onSelectStudent(student.id)}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {getInitials(student.name)}
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
            <p className="text-sm text-slate-500 mb-4 font-mono">{student.rollNumber}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Attendance</p>
                <div className="flex items-center gap-2">
                   <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-indigo-500 h-full rounded-full" style={{width: `${student.attendancePercentage}%`}}></div>
                   </div>
                   <span className="text-xs font-bold text-slate-700">{student.attendancePercentage}%</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current GPA</p>
                <p className="text-sm font-bold text-slate-700">{student.gpa} / 10.0</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <GraduationCap size={16} className="text-slate-400" />
                <span>{student.grade} • Sec {student.section}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                <span>{student.studentPhone}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl border border-indigo-100 text-indigo-600 text-sm font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
              View Academic Record
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
