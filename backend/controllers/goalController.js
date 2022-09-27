const asyncHandler = require("express-async-handler");

const Goal = require("../model/goalModel");
// @desc Get Goals
// @route GET /api/v1/goals
// @access Private

//adding async because the database response uses promises
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find(); //find all goals
  res.status(200).json(goals);
});

// @desc Set Goals
// @route POST /api/v1/goals
// @access Private

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("add a text field 2");
  }

  const goal = await Goal.create({
    text: req.body.text,
  });

  res.status(200).json(goal);
});

// @desc Get Goal
// @route GET /api/v1/goals/:id
// @access Private
const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  res.status(200).json(goal);
});

module.exports = {
  getGoals,
  setGoal,
  getGoal,
};
