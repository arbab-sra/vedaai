import { Request, Response } from 'express';
import { TeacherProfile } from '../models/TeacherProfile';

// GET /api/profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // For prototype, just get the first profile found
    const profile = await TeacherProfile.findOne();
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/profile
export const saveProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, organizationName, occupation } = req.body;
    
    // Find the single profile or create a new one
    let profile = await TeacherProfile.findOne();
    if (profile) {
      profile.fullName = fullName;
      profile.organizationName = organizationName;
      profile.occupation = occupation;
      await profile.save();
    } else {
      profile = new TeacherProfile({ fullName, organizationName, occupation });
      await profile.save();
    }
    
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
