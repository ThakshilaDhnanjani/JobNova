const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register New User
exports.register = async (req, res) => {

    try {
        const { name, email, password, avatar, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
                companyName: user.companyName || '',
                companyDescription: user.companyDescription || '',
                companyLogo: user.companyLogo || '',
                resume: user.resume || '',
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
// Login User
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User .findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '',
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Current User
exports.getMe = async (req, res) => {
    res.json(req.user);
};