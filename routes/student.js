const express = require("express");
const router = express.Router();
const { createStudent, getStudents } = require("../controller/student");

router.post('/student', createStudent);
router.get('/student', getStudents);

module.exports = router;