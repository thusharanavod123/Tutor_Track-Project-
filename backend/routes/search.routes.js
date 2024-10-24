import express from 'express';
import { searchTeachersByName, searchTeachersBySubject, searchTeachersByCity } from '../controllers/search.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();


// Route to search teachers by name
router.get('/teacher/:teacher', protectRoute, searchTeachersByName);


// Route to search teachers by subject
router.get('/subject/:subject', protectRoute, searchTeachersBySubject);

// Route to search teachers by city
router.get('/city/:city', protectRoute, searchTeachersByCity);

export default router;
