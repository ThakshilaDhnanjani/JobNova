const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String },
    salaryRange: { type: String },
    jobType: { 
        type: String, 
        enum: ['full-time', 'part-time', 'contract', 'internship'], 
        required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },// Reference to Employer

    salaryMin: { type: Number },
    salaryMax: { type: Number },
    isClosed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);