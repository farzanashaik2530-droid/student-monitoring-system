
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  grade: string;
  section: string;
  avatar: string;
  attendancePercentage: number;
  gpa: number;
  attendanceHistory: AttendanceRecord[];
  academicDetails: SubjectGrade[];
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface SubjectGrade {
  subject: string;
  grade: string;
  score: number;
}

export type ViewState = 'dashboard' | 'attendance' | 'students' | 'profile';

export interface NotificationLog {
  id: string;
  studentId: string;
  recipient: 'parent' | 'student';
  phone: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'failed';
}
