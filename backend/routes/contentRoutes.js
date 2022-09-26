const express = require('express');
const router = express.Router();
const { getContent, setContent } = require('../controllers/contentController');

router.route('/').get(getContent).post(setContent);

module.exports = router;