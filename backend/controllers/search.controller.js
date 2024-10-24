import User from '../models/user.model.js';

export const searchTeachersByName = async (req, res) => {
    try {
        const { teacher } = req.params;
        const teachers = await User.find({
            fullName: { $regex: teacher, $options: 'i' },
            role: 'teacher'
        }).select('-password');
        console.log('Found teachers by name: ', teachers);
        res.status(200).json(teachers);
    } catch (error) {
        console.log("Error in searchTeachersByName controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchTeachersBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        console.log(`Searching for teachers with subject: ${subject}`);
        
        const student = await User.findById(req.user._id).select('nearestCities');
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        console.log(`Student's nearest cities: ${student.nearestCities}`);

        const subjectRegex = new RegExp(subject, 'i');
        const cityRegexes = student.nearestCities.map(city => new RegExp(city, 'i'));

        const teachers = await User.find({
            teachingSubject: { $regex: subjectRegex },
            teachingCities: { $in: cityRegexes },
            role: 'teacher'
        }).select('-password');

        console.log(`Found teachers: ${teachers.length}`);
      
        res.status(200).json(teachers);
    } catch (error) {
        console.log("Error in searchTeachersBySubject controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchTeachersByCity = async (req, res) => {
    try {
        const { city } = req.params;
        console.log(`Searching for teachers in city: ${city}`);
        
        const student = await User.findById(req.user._id).select('subjects');
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        console.log(`Student's subjects: ${student.subjects}`);

        const cityRegex = new RegExp(city, 'i');

        const teachers = await User.find({
            teachingCities: { $regex: cityRegex },
            teachingSubject: { $in: student.subjects },
            role: 'teacher'
        }).select('-password');

        console.log(`Found teachers: ${teachers.length}`);
      
        res.status(200).json(teachers);
    } catch (error) {
        console.log("Error in searchTeachersByCity controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
