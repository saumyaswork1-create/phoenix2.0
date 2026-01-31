
import { GoogleGenAI, Type } from "@google/genai";
import { GuidanceData, StudentDetails } from "../types";

export const fetchCollegeRecommendations = async (details: StudentDetails): Promise<GuidanceData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As EduGuideAI, provide 5 REAL Indian college recommendations for this student.
    
    STUDENT PROFILE:
    - Academic Metric (May be 12th marks, a Rank, or an Exam Score): ${details.academicMetric}
    - Preferred Course: ${details.preferredCourse}
    - Budget Category: ${details.budgetCategory} (A: <4L, B: 4-8L, C: 8-12L, D: 12-20L, E: >20L)
    - Preferred Location: ${details.preferredLocation}

    CRITICAL INSTRUCTIONS:
    1. ANALYZE METRIC: The user has provided ONE primary academic metric (${details.academicMetric}). Identify if it is a board percentage, a competitive rank (like JEE AIR), or a score, and use it to determine eligibility for colleges.
    2. PRIORITIZE LOCATION: Find real colleges strictly within or very near ${details.preferredLocation} first. 
    3. BUDGET MATCH: Ensure total fees match budget category ${details.budgetCategory} strictly.
    4. LOCATION NOTE: If you cannot find 5 colleges in ${details.preferredLocation} that match budget/marks, suggest the best alternatives in nearby metros and provide a 'locationNote'.
    5. STUDY PLAN: Create a personalized study plan for the most relevant entrance exam for ${details.preferredCourse}.
    6. ASSIGN IDs: Give each college a unique 'id' string.

    Return ONLY valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                collegeName: { type: Type.STRING },
                course: { type: Type.STRING },
                fees: {
                  type: Type.OBJECT,
                  properties: { total: { type: Type.STRING } },
                  required: ['total']
                },
                admissions: {
                  type: Type.OBJECT,
                  properties: {
                    entranceExam: { type: Type.STRING },
                    tentativeExamDate: { type: Type.STRING },
                    admissionWindow: { type: Type.STRING },
                    openingRanks: {
                      type: Type.OBJECT,
                      properties: { GEN: { type: Type.STRING }, OBC: { type: Type.STRING }, SC: { type: Type.STRING }, ST: { type: Type.STRING } },
                      required: ['GEN', 'OBC', 'SC', 'ST']
                    },
                    closingRanks: {
                      type: Type.OBJECT,
                      properties: { GEN: { type: Type.STRING }, OBC: { type: Type.STRING }, SC: { type: Type.STRING }, ST: { type: Type.STRING } },
                      required: ['GEN', 'OBC', 'SC', 'ST']
                    }
                  },
                  required: ['entranceExam', 'tentativeExamDate', 'admissionWindow', 'openingRanks', 'closingRanks']
                },
                scholarships: { type: Type.ARRAY, items: { type: Type.STRING } },
                placements: {
                  type: Type.OBJECT,
                  properties: {
                    averagePackage: { type: Type.STRING },
                    topRecruiters: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['averagePackage', 'topRecruiters']
                },
                notableAlumni: { type: Type.ARRAY, items: { type: Type.STRING } },
                careerOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                foreignTieUps: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ['id', 'collegeName', 'course', 'fees', 'admissions', 'scholarships', 'placements', 'notableAlumni', 'careerOutcomes', 'foreignTieUps', 'summary']
            }
          },
          studyPlan: {
            type: Type.OBJECT,
            properties: {
              examName: { type: Type.STRING },
              roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING },
                    link: { type: Type.STRING }
                  },
                  required: ['title', 'type', 'link']
                }
              }
            },
            required: ['examName', 'roadmap', 'tips', 'recommendedResources']
          },
          careerCounsellor: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              specialization: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              bookingLink: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ['name', 'specialization', 'phone', 'email', 'bookingLink', 'note']
          },
          studentNextSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          locationNote: { type: Type.STRING }
        },
        required: ['recommendations', 'studyPlan', 'careerCounsellor', 'studentNextSteps']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response from AI engine");
  }
};
