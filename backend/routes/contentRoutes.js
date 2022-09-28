const express = require('express');
const router = express.Router();
const { getContent, getDownload, setContent } = require('../controllers/contentController');

router.route('/').get(getContent).post(setContent);
router.route('/:id/download-url').get(getDownload);

module.exports = router;