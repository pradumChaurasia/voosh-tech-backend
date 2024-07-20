const express = require('express');
const { isAuthenticated } = require('../middleware/auth.js');
const { createTask, getTasks, updateTask, deleteTask } = require('../controller/authcontroller.js');

const router = express.Router();

router.post('/createTask',isAuthenticated, createTask);
router.get('/getTasks',isAuthenticated, getTasks);
router.put('/updateTask/:id', isAuthenticated, updateTask);
router.delete('/deleteTask/:id', isAuthenticated, deleteTask);

module.exports = router;