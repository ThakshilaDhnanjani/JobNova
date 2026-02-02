const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// create new job (employer only)
exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can create jobs" });
        }

        const job = await Job.create({...req.body, company: req.user._id});
        res.status(201).json(job);
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// get all jobs with filters and pagination
exports.getJobs = async (req, res) => {
    const {
        keyword,
        location,
        category,
        type,
        minSalary,
        maxSalary,
        userId,
    }= req.query;

    const query ={
        isClosed: false,
        ... (keyword && { title: { $regex: keyword, $options: "i" } }),
        ... (location && { location: { $regex: location, $options: "i" } }),
        ... (category && { category }),
        ... (type && { type }),
    };

        if (minSalary || maxSalary) {
            query.$and = [];
            if (minSalary) {
                query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
            }
            if (maxSalary) {
                query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
            }
            if (query.$and.length === 0) {
                delete query.$and;
            }
        };
            
    try {
        const jobs = await Job.find(query).populate(
            "company", "name companyLogo"
        );
        let SavedJobIds = [];
        let appliedJobStatusMap = {};

        if (userId) {
            //Saved Jobs
            const savedJobs = await SavedJob.find({ jobseeker: userId }).select("job");
            SavedJobIds = savedJobs.map((s) => String(s.job));

            //Application
            const applications = await Application.find({ applicant: userId }).select("job status");
            applications.forEach((app) => {
                appliedJobStatusMap[String(app.job)] = app.status;
            });
        }

        //Attach isSaved and applicationStatus to each job
        const jobsWithExtras = jobs.map((job) => {
            const jobIdStr = job.String(job._id);
            return {
                ...job.toObject(),
                isSaved: SavedJobIds.includes(jobIdStr),
                applicationStatus: appliedJobStatusMap[jobIdStr] || null,
            };
        });
        res.json(jobsWithExtras);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

//get jobs for logged in user(Employer can see posted jobs)
exports.getJobsEmployer = async (req, res) => {
    try {
        const userId = req.user._id;
        const { role } = req.user;

        if (role !== "employer") {
            return res.status(403).json({ message: "Only employers can access their posted jobs" });
        }

        //get jobs posted by this employer
        const jobs = await Job.find({ company: userId })
        .populate("company", "name companyName companyLogo")
        .lean(); // Use .lean() to get plain JS objects

        //for each job, get number of applications
            const jobsWithApplicationCounts = await Promise.all(
                jobs.map(async (job) => {
                    const applicationCount = await Application.countDocuments({ job: job._id });
                    return {
                        ...job,
                        applicationCount,
                    };
                })
            );
        res.json(jobsWithApplicationCounts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// get job by id
exports.getJobById = async (req, res) => {
    try {
        const { userId } = req.query;
        const job = await Job.findById(req.params.id).populate(
            "company", "name companyName companyLogo"
        );

        if (!job) {
            return  res.status(404).json({ message: "Job not found" });
        }

        let applicationStatus = null;

        if (userId) {

            //check application status
            const application = await Application.findOne({
                job: job._id,
                applicant: userId,
            }).select("status");
            if (application) {
                applicationStatus = application.status;
            }
        }

        res.json({
            ...job.toObject(),
            applicationStatus,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// update job by id (employer only)
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        //check if the logged in user is the employer who posted the job
        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this job" });
        }

        //update job fields
        Object.assign(job, req.body);
        const updated = await job.save();
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};  

//delete job by id (employer only)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        //check if the logged in user is the employer who posted the job
        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this job" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

//toggle close/open job (employer only)
exports.toggleCloseJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        //check if the logged in user is the employer who posted the job
        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this job" });
        }

        job.isClosed = !job.isClosed;
        await job.save();
        res.json({ message: "Job Marked As Closed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
} ;
