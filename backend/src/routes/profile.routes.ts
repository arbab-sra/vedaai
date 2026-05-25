import { Router } from 'express';
import { getProfile, saveProfile } from '../controllers/profile.controller';

const router = Router();

router.get('/', getProfile);
router.post('/', saveProfile);

export default router;
