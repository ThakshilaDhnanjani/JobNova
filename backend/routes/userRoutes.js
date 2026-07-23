const express = require("express");
 
const {
    updateProfile,
    deleteResume,
    getPublicProfile,
    viewProfile,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
}= require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

//protect routes
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);
router.get("/viewProfile", protect, viewProfile);
router.post("/add-experience", protect, addExperience);
router.delete("/delete-experience/:expId", protect, deleteExperience);
router.post("/add-education", protect, addEducation);
router.delete("/delete-education/:eduId", protect, deleteEducation);

//public profile route
router.get("/:id", getPublicProfile);

module.exports = router;