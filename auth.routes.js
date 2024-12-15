import express from 'express';
import { getMe, signup, login, logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { protectRole } from '../middleware/protectRole.js';
import { searchTeachersByName, searchTeachersBySubject, searchTeachersByCity } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/me', protectRoute, getMe);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/teacher-data', protectRoute, protectRole(['teacher']), (req, res) => {
    res.status(200).json({ message: "Teacher data" });
});

router.get('/student-data', protectRoute, protectRole(['student']), (req, res) => {
    res.status(200).json({ message: "Student data" });
});

// Search routes
router.get('/search/teachers/name', protectRoute, protectRole(['student']), searchTeachersByName);
router.get('/search/teachers/subject', protectRoute, protectRole(['student']), searchTeachersBySubject);
router.get('/search/teachers/city', protectRoute, protectRole(['student']), searchTeachersByCity);

export default router;