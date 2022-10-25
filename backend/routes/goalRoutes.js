const express = require('express');
const router = express.Router();
const { getGoals, setGoal, getGoal } = require('../controllers/goalController');

router.route('/').get(getGoals).post(setGoal); //same as router.get('/', getGoals); + router.post('/', setGoal);

router.route('/:id').get(getGoal); //same as router.get('/:id', getGoal);

module.exports = router;