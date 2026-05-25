import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { generationQueue } from '../services/queue.service';
import { getCache, setCache, invalidateCache } from '../services/cache.service';
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, dueDate, difficulty, targetAudience, configuration } = req.body;
    let syllabusText = '';

    let filePayload = null;
    if (req.file) {
      const mimeType = req.file.mimetype;
      if (!mimeType.startsWith('image/') && mimeType !== 'application/pdf' && !mimeType.startsWith('text/') && mimeType !== 'application/json') {
        res.status(400).json({ success: false, error: `Unsupported file format (${mimeType}). Please upload a PDF, Image, or text file.` });
        return;
      }
      filePayload = {
        buffer: req.file.buffer.toString('base64'),
        mimeType: mimeType
      };
    }

    const assignment = new Assignment({
      title,
      dueDate,
      difficulty: difficulty || 'Mixed',
      targetAudience: targetAudience || 'All Learners',
      syllabusText: syllabusText.trim(),
      configuration: typeof configuration === 'string' ? JSON.parse(configuration) : configuration,
      status: 'PENDING',
    });

    await assignment.save();

    // Invalidate list cache
    await invalidateCache('assignments_list');

    // Add job to BullMQ queue
    await generationQueue.add('generate-paper', { 
      assignmentId: assignment._id.toString(),
      filePayload
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'assignments_list';
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      res.status(200).json({ success: true, data: cachedData, cached: true });
      return;
    }

    const assignments = await Assignment.find().sort({ createdAt: -1 });
    await setCache(cacheKey, assignments, 30); // cache for 30 seconds

    res.status(200).json({ success: true, data: assignments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = `assignment_${req.params.id}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      res.status(200).json({ success: true, data: cachedData, cached: true });
      return;
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found' });
      return;
    }
    
    await setCache(cacheKey, assignment, 30); // cache for 30 seconds
    
    res.status(200).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found' });
      return;
    }

    // Invalidate caches
    await invalidateCache('assignments_list');
    await invalidateCache(`assignment_${req.params.id}`);

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
