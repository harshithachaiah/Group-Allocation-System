const router = require("express").Router();
const userRoutes = require("./userRoutes");
const studentRoutes = require("./studentRoutes");
const supervisorRoutes = require("./supervisorRoutes")
const adminRoutes = require("./adminRoutes")

// User Routes
router.use("/user", userRoutes);
router.use("/student", studentRoutes);
router.use("/supervisor", supervisorRoutes);
router.use("/admin", adminRoutes);


module.exports = router;