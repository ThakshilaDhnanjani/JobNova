const express = require("express");
 
const {
    updateProfile,
    deleteResume,
    getPublicProfile,
    viewProfile
}= require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

//protect routes
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);
router.get("/viewProfile", protect, viewProfile); // Get the authenticated user's profile

//public profile route
router.get("/:id", getPublicProfile);

module.exports = router;