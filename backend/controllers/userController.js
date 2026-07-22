const fs = require("fs");
const path = require('path');
const User = require("../models/User");

//update user profile 
exports.updateProfile = async (req, res) => {

    const { name, avatar, resume, companyName, companyDescription, companyLogo } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        // if employer, allow update company details
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || '',
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message});
    }
};

// delete resume file
exports.deleteResume = async (req, res) => {
    try {
        const {resumeUrl} = req.body; // URL of the resume to delete

        // Extract filename from URL
        const fileName = resumeUrl.split('/')?.pop();

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role !== "jobseeker")
            return res.status(403).json({ message: "Only jobseekers can delete resumes" });

        // Construct full file path
        const filePath = path.join(__dirname, '../uploads', fileName);

        //Check if file exists then delete
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath); //delete file
        }

        //set the user's resume field to null
        user.resume = '';
        await user.save();

        res.json({ message: "Resume deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message});
    }
};

//get user publiuc profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message});
    }
};

exports.viewProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            success: true,
            data: user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.addExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { jobTitle, companyName, location, startDate, endDate, current, description } = req.body;
        user.experience.unshift({ jobTitle, companyName, location, startDate, endDate, current, description });
        await user.save();
        res.json({
            success: true,
            data: user.experience
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const expId = req.params.expId || req.params.exp_id;
        const expIndex = user.experience.findIndex(exp => exp._id.toString() === expId);
        if (expIndex === -1) return res.status(404).json({ message: "Experience not found" });

        user.experience.splice(expIndex, 1);
        await user.save();
        res.json({
            success: true,
            data: user.experience
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.addEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { schoolName, degree, fieldOfStudy, startDate, endDate, current, description } = req.body;
        user.education.unshift({ schoolName, degree, fieldOfStudy, startDate, endDate, current, description });
        await user.save();
        res.json({
            success: true,
            data: user.education
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const eduId = req.params.eduId || req.params.edu_id;
        const eduIndex = user.education.findIndex(edu => edu._id.toString() === eduId);
        if (eduIndex === -1) return res.status(404).json({ message: "Education not found" });

        user.education.splice(eduIndex, 1);
        await user.save();
        res.json({  
            success: true,
            data: user.education
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};