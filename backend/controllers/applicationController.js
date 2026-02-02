const Application = require("../models/Application");
const Job = require("../models/Job");

// apply to a job (jobseeker only)
exports.applyToJob = async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return  res.status(403).json({ message: "Only jobseekers can apply to jobs" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: job._id,
            applicant: req.user._id,
        });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied to this job" });
        }

        const application = await Application.create({
            job: job._id,
            applicant: req.user._id,
            resume: req.user.resume, // assuming resume is stored in user profile
            status: "applied",
        });

        res.status(201).json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// get logged in user applications (jobseeker only)
exports.getMyApplications = async (req, res) => {
    try {
        const apps = (await Application.find({ applicant: req.user._id }).populate("job", "title company location type")).sort({createdAt: -1});
        res.json(apps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};  
// get all applicants for a job (employer only)
exports.getApplicansForJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.jobId);

        // Check if the job belongs to the employer
        if (!job || job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only view applicants for your own jobs" });
        }

        const applications = await Application.find({ job: req.params.jobId }).populate("job", "title location category type").populate("applicant", "name email avatar resume");
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// get application by id(seeker or employer)
exports.getApplicationById = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id)
            .populate("job", "title")
            .populate("applicant", "name email avatar resume");

        if (!app) {
            return res.status(404).json({ message: "Application not found", id: req.params.id });
        }

        // Ensure that only the applicant or the employer can view the application
        const isOwner =
            app.applicant._id.toString() === req.user._id.toString() ||
            app.job.company.toString() === req.user._id.toString();
        if (!isOwner) {
            return res.status(403).json({ message: "You do not have permission to view this application" });
        }

        res.json(app);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// update application status (employer only)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findById(req.params.id).populate("job");
        
        // Check if the job belongs to the employer
        if (!app || app.job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update applications for your own jobs" });
        }

        app.status = status;
        await app.save();

        res.json({ message: "Application status updated", status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};  

