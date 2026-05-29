const SavedJob = require("../models/SavedJob");

//@desc Save a job
exports.saveJob = async (req, res) => {
    try {
        const exists= await SavedJob.findOne({
            job: req.params.jobId,
            jobseeker: req.user._id,
        });
        if (exists) {
            return res.status(400).json({ message: "Job already saved" });
        }

        const savedJobs = await SavedJob.create({
            job: req.params.jobId,
            jobseeker: req.user._id,
        });

        res.status(201).json(savedJobs);
    } catch (err) {
        res.status(500).json({ message: "Fail to Save Job", error: err.message });
    }
};

//@desc Unsave a Job
exports.unsaveJob = async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({ job: req.params.jobId, jobseeker: req.user._id});
        res.json({ message: "Job Removed From Saved List"});
    } catch (err) {
        res.status(500).json({ message: "Fail to Remove Saved Job", error:err.message})
    }
};

//Get Saved Job For Current User
exports.getMySavedJobs = async (req, res) => {
    try {
        const SavedJobs = await SavedJob.find({ jobseeker: req.user._id})
        .populate ({
            path: "job",
            populate: {
                path: "company",
                select: "name companyName companyLogo"
            },
        })
        res.json(SavedJobs);
    } catch (err) {
        res.status(500).json({ message: "Fail to Fetch Saved Jobs", error:err.message})
    }
};