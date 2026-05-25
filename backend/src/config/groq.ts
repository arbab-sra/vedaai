import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

export const groq = apiKey ? new Groq({ apiKey }) : null;

if (!apiKey) {
  console.warn('⚠️ GROQ_API_KEY is not set in environment variables. AI Generation will fail.');
}
