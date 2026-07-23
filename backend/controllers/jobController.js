const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

const fallbackJobs = [
    {
        _id: "demo-job-1",
        title: "Frontend Developer",
        description: "Build polished user experiences for our product team.",
        requirements: "React, Tailwind, accessibility experience",
        location: "Remote",
        category: "Engineering",
        salaryMin: 120000,
        salaryMax: 160000,
        salaryRange: "$120k - $160k",
        jobType: "full-time",
        company: {
            _id: "demo-company-1",
            companyName: "Northstar Labs",
            companyLogo: "",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isClosed: false,
        type: "Full-time",
        isSaved: false,
        applicationStatus: null,
    },
    {
        _id: "demo-job-2",
        title: "Product Designer",
        description: "Design intuitive hiring workflows for job seekers and employers.",
        requirements: "Figma, UI systems, user research",
        location: "New York, NY",
        category: "Design",
        salaryMin: 100000,
        salaryMax: 140000,
        salaryRange: "$100k - $140k",
        jobType: "full-time",
        company: {
            _id: "demo-company-2",
            companyName: "BrightPath",
            companyLogo: "",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isClosed: false,
        type: "Full-time",
        isSaved: false,
        applicationStatus: null,
    },
];

const getFallbackJobs = (userId = null) =>
    fallbackJobs.map((job) => ({
        ...job,
        isSaved: false,
        applicationStatus: null,
    }));

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
        jobType,
        minSalary,
        maxSalary,
        userId,
    }= req.query;

    const selectedJobType = type || jobType;

    const query ={
        isClosed: false,
        ... (keyword && { title: { $regex: keyword, $options: "i" } }),
        ... (location && { location: { $regex: location, $options: "i" } }),
        ... (category && { category }),
        ... (selectedJobType && { jobType: selectedJobType }),
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
        if (mongoose.connection.readyState !== 1) {
            return res.json(getFallbackJobs(userId));
        }

        const jobs = await Job.find(query).populate(
            "company", "companyName companyLogo"
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
            const jobObj = job.toObject();
            const jobIdStr = String(job._id);
            return {
                ...jobObj,
                category: jobObj.category || 'Other',
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
        .lean({ virtuals: true }); // Use .lean() to get plain JS objects and include virtuals

        //for each job, get number of applications
            const jobsWithApplicationCounts = await Promise.all(
                jobs.map(async (job) => {
                    const applicationCount = await Application.countDocuments({ job: job._id });
                    return {
                        ...job,
                        category: job.category || 'Other',
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

        const jobObj = job.toObject();
        res.json({
            ...jobObj,
            category: jobObj.category || 'Other',
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
