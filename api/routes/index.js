const Router = require('express');
const router = new Router();
const tasksRouter = require('./tasksRouter')


router.use('/tasks', tasksRouter);

module.exports = router;