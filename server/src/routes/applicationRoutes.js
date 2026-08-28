const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
} = require("../controllers/applicationController");


// All application routes require authentication
router.use(protect);


// Get all applications
router.get("/", getApplications);


// Get one application
router.get("/:id", getApplication);


// Create application
router.post("/", createApplication);


// Update application
router.put("/:id", updateApplication);


// Delete application
router.delete("/:id", deleteApplication);


module.exports = router;