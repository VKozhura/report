const Router = require('express');
const router = new Router();


router.get('/', async (req, res) => {
    let tasks;
    return res.json(tasks)
});

module.exports = router;