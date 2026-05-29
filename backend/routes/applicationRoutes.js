const   express = require("express");
const {
    applyToJob,
    getMyApplications,
    getApplicansForJob,
    getApplicantsForEmployerJobs,
    getApplicationById,
    updateStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:jobId", protect, applyToJob);
router.get("/my", protect, getMyApplications);
router.get("/employer", protect, getApplicantsForEmployerJobs);
router.get("/job/:jobId", protect, getApplicansForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateStatus);

module.exports = router;