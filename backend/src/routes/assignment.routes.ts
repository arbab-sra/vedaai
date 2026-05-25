import { Router } from 'express';
import multer from 'multer';
import { createAssignment, getAssignments, getAssignmentById, deleteAssignment } from '../controllers/assignment.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);

export default router;
