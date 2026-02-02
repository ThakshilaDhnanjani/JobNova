const express = require("express");
 
const {
    updateProfile,
    deleteResume,
    getPublicProfile,
}= require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

//protect routes
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);

//public profile route
router.get("/:id", getPublicProfile);

module.exports = router;