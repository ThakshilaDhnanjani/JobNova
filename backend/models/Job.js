const mongoose = require("mongoose");


const JOB_TYPE_LABELS = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
};

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String },
    category: { type: String, required: true, default: 'Other' },
    salaryRange: { type: String },
    jobType: { 
        type: String, 
        enum: ['full-time', 'part-time', 'contract', 'internship'], 
        required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },// Reference to Employer

    salaryMin: { type: Number },
    salaryMax: { type: Number },
    isClosed: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

jobSchema.virtual('type').get(function() {
    return this.jobType ? JOB_TYPE_LABELS[this.jobType] || this.jobType : undefined;
});

module.exports = mongoose.model("Job", jobSchema);