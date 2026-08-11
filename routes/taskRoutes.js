const express = require("express");

const router = express.Router();

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

// Protect all task routes
router.use(protect);

// CREATE
router.post("/", createTask);

// READ
router.get("/", getTasks);

// UPDATE
router.put("/:id", updateTask);

// DELETE
router.delete("/:id", deleteTask);

module.exports = router;