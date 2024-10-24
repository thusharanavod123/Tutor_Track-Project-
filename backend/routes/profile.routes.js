// routes/profile.js
import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getProfile, getUserProfileById, updateProfile } from '../controllers/profile.controller.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.get('/profile', protectRoute, getProfile);
router.get('/:userId', protectRoute, getUserProfileById); // New route for fetching another user's profile by ID
router.put('/update', protectRoute, upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), updateProfile);

export default router;
