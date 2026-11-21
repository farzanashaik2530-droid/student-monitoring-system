
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

// Always initialize with named parameter and direct process.env.API_KEY reference
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Generates a personalized absence notification including academic summary.
   */
  generateAbsenceMessage: async (student: Student, recipientType: 'parent' | 'student'): Promise<string> => {
    try {
      const date = new Date().toLocaleDateString();
      const performanceSummary = student.academicDetails.map(s => `${s.subject}: ${s.grade}`).join(', ');
      
      const prompt = recipientType === 'parent' 
        ? `Generate a professional SMS for a parent. 
           Student: ${student.name}
           Date: ${date}
           Status: Absent
           Academic Brief: GPA ${student.gpa}, Attendance ${student.attendancePercentage}%, Grades: ${performanceSummary}
           Requirement: Notify them of absence and provide this academic snapshot. Max 160 chars.`
        : `Generate an urgent SMS for a student.
           Name: ${student.name}
           Date: ${date}
           Status: You were marked ABSENT.
           Academic Brief: Your current GPA is ${student.gpa}.
           Requirement: Alert them of their absence and remind them to stay on track. Max 160 chars.`;

      // Using gemini-3-flash-preview for basic text task
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      
      // Accessing text property directly as per latest SDK guidelines
      return response.text?.trim() || `EduGuard: ${student.name} marked absent on ${date}. Current GPA: ${student.gpa}. Please contact school.`;
    } catch (error) {
      console.error("Gemini Error:", error);
      const date = new Date().toLocaleDateString();
      return `EduGuard: ${student.name} marked absent on ${date}. GPA: ${student.gpa}. Contact admin.`;
    }
  },

  /**
   * Analyzes student academic performance and provides insights.
   */
  getPerformanceInsights: async (student: Student): Promise<string> => {
    try {
      const performanceSummary = student.academicDetails.map(s => `${s.subject}: ${s.grade}`).join(', ');
      // Using gemini-3-flash-preview for summarization task
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this student's performance and provide a short, encouraging summary for a teacher's report.
        Name: ${student.name}
        GPA: ${student.gpa}
        Attendance: ${student.attendancePercentage}%
        Grades: ${performanceSummary}`,
        config: {
          temperature: 0.7,
        }
      });
      // Accessing text property directly
      return response.text || "Student is performing well overall.";
    } catch (error) {
      return "Unable to generate insights at this time.";
    }
  }
};
