const router = require('express').Router();
const mailController = require('../controller/mailController');

router.route('/')
    .post(mailController.sendMail)

module.exports = router;