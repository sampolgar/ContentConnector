const asyncHandler = require('express-async-handler');
// @desc Get Goals
// @route GET /api/v1/goals
// @access Private

//adding async because the database response uses promises
const getGoals = asyncHandler(async (req, res) => {              
    res.status(200).json({message: 'get goals'})
})

// @desc Set Goals
// @route POST /api/v1/goals
// @access Private

const setGoal = asyncHandler( async (req, res) => {

    if(!req.body.test){
        res.status(400)
        throw new Error('add a text field')
    }
    res.status(200).json({message: 'set goal'})
})

// @desc Get Goal
// @route GET /api/v1/goals/:id
// @access Private

const getGoal = asyncHandler(async (req, res) => {
    res.status(200).json({message: `get goal ${req.params.id}`})
})

module.exports = {
    getGoals,
    setGoal,
    getGoal
}