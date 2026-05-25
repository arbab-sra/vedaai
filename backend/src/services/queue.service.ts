import { Queue, Worker } from 'bullmq';
import { createRedisConnection } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { invalidateCache } from './cache.service';
import { generateQuestionPaper } from './ai.service';
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

export const generationQueue = new Queue('generation-queue', { connection: createRedisConnection() });

export const initQueueWorkers = async () => {
  const worker = new Worker(
    'generation-queue',
    async (job) => {
      const { assignmentId, filePayload } = job.data;
      
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment with ID ${assignmentId} not found`);
      }

      if (filePayload) {
        // Update status to EXTRACTING_TEXT
        assignment.status = 'EXTRACTING_TEXT';
        await assignment.save();
        await invalidateCache('assignments_list');
        await invalidateCache(`assignment_${assignmentId}`);

        const { buffer: base64Str, mimeType } = filePayload;
        const buffer = Buffer.from(base64Str, 'base64');
        let syllabusText = '';

        if (mimeType === 'application/pdf') {
          try {
            const pdfData = await pdfParse(buffer);
            syllabusText = pdfData.text;
          } catch (err) {
            console.error('Failed to parse PDF:', err);
            syllabusText = 'Error parsing PDF syllabus.';
          }
        } else if (mimeType.startsWith('image/')) {
          try {
            const result = await Tesseract.recognize(buffer, 'eng');
            syllabusText = result.data.text;
          } catch (err) {
            console.error('Failed to extract text from image:', err);
            syllabusText = 'Error extracting text from image.';
          }
        } else if (mimeType.startsWith('text/') || mimeType === 'application/json') {
          syllabusText = buffer.toString('utf-8');
        }

        assignment.syllabusText = syllabusText.trim();
        await assignment.save();
      }

      // Update status to GENERATING
      assignment.status = 'GENERATING';
      await assignment.save();
      await invalidateCache('assignments_list');
      await invalidateCache(`assignment_${assignmentId}`);

      try {
        // Generate via AI
        const generatedPaper = await generateQuestionPaper(assignment);

        // Save result
        assignment.generatedPaper = generatedPaper;
        assignment.status = 'COMPLETED';
        await assignment.save();
        await invalidateCache('assignments_list');
        await invalidateCache(`assignment_${assignmentId}`);
        
      } catch (error: any) {
        console.error(`Job failed for assignment ${assignmentId}:`, error);
        assignment.status = 'FAILED';
        await assignment.save();
        await invalidateCache('assignments_list');
        await invalidateCache(`assignment_${assignmentId}`);
        
        throw error;
      }
    },
    { connection: createRedisConnection() }
  );

};
