import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, role} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({error: "Invalid email"});
        }

        if (!["student", "teacher"].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'student' or 'teacher'" });
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: "User already exists"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error: "Email already exists"});
        }

        if(password.length < 6){
            return res.status(400).json({error: "Password must be at least 6 characters"});
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password:  hashedPassword,
            role
        });

        if(newUser){
            
            await newUser.save();
            const jwt = generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                profileImage: newUser.profileImage,
                coverImage: newUser.coverImage,
                jwtToken:jwt
            })

        }else{
            res.status(400).json({error: "Invalid user data"});

        }


    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        // If user not found or password doesn't match, return error
        if (!user || !(await bcrypt.compare(password, user.password || ""))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
    
        // Generate JWT and set cookie
        const jwt = generateTokenAndSetCookie(user._id, res);
    
        // Return user data and JWT token in response
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            jwtToken: jwt
        });
    
    }catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};
