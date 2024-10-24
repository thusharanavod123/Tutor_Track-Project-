// controllers/profile.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, password, subjects, teachingSubject, teachingCities, nearestCities, fullName, email } = req.body;

        const updates = {};

        if (req.files) {
            if (req.files.profileImage) {
                const result = await cloudinary.uploader.upload(req.files.profileImage[0].path);
                updates.profileImage = result.secure_url;
            }
            if (req.files.coverImage) {
                const result = await cloudinary.uploader.upload(req.files.coverImage[0].path);
                updates.coverImage = result.secure_url;
            }
        }

        // Validate and set the fields to be updated
        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
                return res.status(400).json({ error: "Username already taken" });
            }
            updates.username = username;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        if (fullName) {
            updates.fullName = fullName;
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== req.user._id.toString()) {
                return res.status(400).json({ error: "Email already taken" });
            }
            updates.email = email;
        }

        // Handle role-specific updates
        if (req.user.role === 'student') {
            updates.subjects = subjects.split(',').map(subject => subject.trim());
            updates.nearestCities = nearestCities.split(',').map(city => city.trim());
        } else if (req.user.role === 'teacher') {
            updates.teachingSubject = teachingSubject;
            updates.teachingCities = teachingCities.split(',').map(city => city.trim());
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
