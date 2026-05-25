import { groq } from "../config/groq";
import { IAssignment, IQuestionPaper } from "../models/Assignment";
import { TeacherProfile } from "../models/TeacherProfile";
import { z } from "zod";

const QuestionSchema = z.object({
  questionText: z.string(),
  difficulty: z.enum(["Easy", "Moderate", "Hard", "Challenging"]),
  marks: z.number(),
  options: z.array(z.string()).nullable().optional().transform(val => val ?? undefined),
});

const SectionSchema = z.object({
  title: z.string(),
  instruction: z.string(),
  questions: z.array(QuestionSchema),
});

const QuestionPaperSchema = z.object({
  institutionName: z.string().nullable().optional().transform(val => val ?? undefined),
  topic: z.string().nullable().optional().transform(val => val ?? undefined),
  targetAudience: z.string().nullable().optional().transform(val => val ?? undefined),
  timeAllowed: z.string().nullable().optional().transform(val => val ?? undefined),
  maximumMarks: z.number().nullable().optional().transform(val => val ?? undefined),
  sections: z.array(SectionSchema),
  answerKey: z.array(z.string()),
});

// JSON Schema representation for Groq's native structured outputs
const questionPaperJsonSchema = {
  type: "object",
  properties: {
    institutionName: { type: ["string", "null"] },
    topic: { type: ["string", "null"] },
    targetAudience: { type: ["string", "null"] },
    timeAllowed: { type: ["string", "null"] },
    maximumMarks: { type: ["number", "null"] },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          instruction: { type: "string" },
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionText: { type: "string" },
                difficulty: { type: "string", enum: ["Easy", "Moderate", "Hard", "Challenging"] },
                marks: { type: "number" },
                options: {
                  type: ["array", "null"],
                  items: { type: "string" }
                }
              },
              required: ["questionText", "difficulty", "marks", "options"],
              additionalProperties: false
            }
          }
        },
        required: ["title", "instruction", "questions"],
        additionalProperties: false
      }
    },
    answerKey: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["institutionName", "topic", "targetAudience", "timeAllowed", "maximumMarks", "sections", "answerKey"],
  additionalProperties: false
};

export const generateQuestionPaper = async (
  assignment: IAssignment,
): Promise<IQuestionPaper> => {
  const { configuration } = assignment;
  
  // Fetch teacher profile if exists
  const teacherProfile = await TeacherProfile.findOne();
  const orgName = teacherProfile?.organizationName || "VedaAI Learning Hub";
  const teacherContext = teacherProfile 
    ? `The creator of this assignment is ${teacherProfile.fullName}, a ${teacherProfile.occupation} at ${teacherProfile.organizationName}. Please use this organization name for the institutionName.`
    : "The creator is a standard educator.";

  if (!groq) {
    console.warn(
      "Groq SDK is not initialized. Returning mock data instead of failing.",
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      institutionName: orgName,
      topic: assignment.title || "Sample Topic",
      targetAudience: "All Learners",
      timeAllowed: "60 minutes",
      maximumMarks: configuration.totalMarks,
      sections: configuration.questionTypes.map((qt, i) => ({
        title: `Section ${String.fromCharCode(65 + i)}: ${qt.type}`,
        instruction: `Attempt all questions. Total marks: ${qt.marks}`,
        questions: Array.from({ length: qt.count }).map((_, j) => ({
          questionText: `This is a generated mock question ${j + 1} for ${qt.type}. Explain in detail.`,
          difficulty: "Moderate",
          marks: Math.round((qt.marks / qt.count) * 10) / 10,
          options: qt.type.toLowerCase().includes("multiple choice") ? ["Option A", "Option B", "Option C", "Option D"] : undefined
        })),
      })),
      answerKey: ["1. Mock answer 1", "2. Mock answer 2"],
    };
  }

  const prompt = `
    You are an expert AI educator. Generate a question paper in JSON format.
    
    INPUTS:
    - Topic: "${assignment.title}"
    - Creator: ${teacherContext}
    - Audience: ${assignment.targetAudience || "All Learners"}
    - Questions Needed: ${configuration.questionTypes.map((qt) => `${qt.count}x ${qt.type}`).join(", ")}
    - Total Marks: ${configuration.totalMarks}
    - Instructions: ${configuration.instructions || "None"}
    - Syllabus: ${assignment.syllabusText ? (assignment.syllabusText.length > 5000 ? assignment.syllabusText.substring(0, 5000) + '...' : assignment.syllabusText) : "General knowledge"}

    YOUR OUTPUT MUST MATCH THIS EXACT JSON STRUCTURE (DO NOT ADD OR CHANGE KEYS):
    {
      "institutionName": "Name of institution based on creator",
      "topic": "Topic name",
      "targetAudience": "Audience",
      "timeAllowed": "e.g. 45 minutes",
      "maximumMarks": ${configuration.totalMarks},
      "sections": [
        {
          "title": "Section Title",
          "instruction": "Section instructions",
          "questions": [
            {
              "questionText": "Write the question here",
              "difficulty": "Easy" | "Moderate" | "Hard" | "Challenging",
              "marks": 5,
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"] // ONLY ADD THIS ARRAY IF IT IS A MULTIPLE CHOICE QUESTION
            }
          ]
        }
      ],
      "answerKey": [
        "1. First Answer",
        "2. Second Answer"
      ]
    }
    
    IMPORTANT: You MUST return ONLY valid JSON. Do not include introductory text, do not include markdown formatting, and do not use conversational tokens.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a rigid API that outputs only pure JSON. No conversational text or markdown is allowed." },
        { role: "user", content: prompt }
      ],
      model: process.env.AI_MODEL || "qwen/qwen3-32b",
      temperature: 0.2,
      max_tokens: 8000,
      // Intentionally omitting response_format because the Qwen model hallucinates chat tokens that crash Groq's strict validator.
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Clean up any markdown blocks or stray chat tokens
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/<\|.*?\|>/g, "") // Strip Qwen chat tokens
      .trim();
      
    // Find the first { and last } to extract the raw JSON
    const firstBrace = cleanedContent.indexOf('{');
    const lastBrace = cleanedContent.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      throw new Error("No JSON object found in the AI response.");
    }
    
    const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
    const parsedData = JSON.parse(jsonString);
    return QuestionPaperSchema.parse(parsedData);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate question paper. Please try again.");
  }
};
