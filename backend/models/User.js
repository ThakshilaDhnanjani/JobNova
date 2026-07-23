const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['jobseeker', 'employer'], required: true },
    avatar: String ,
    resume: String ,

    //for employers
    companyName: String,
    companyDescription: String,
    companyLogo: String
}, { timestamps: true });

const experienceSchema  = new mongoose.Schema({
    jobTitle: String,
    companyName: String,
    startDate: Date,
    endDate: Date,
    description: String,
    current: Boolean,
    location: String    
});

const educationSchema = new mongoose.Schema({
    schoolName: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
});

// Hash password before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.matchPassword = function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);