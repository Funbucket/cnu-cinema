const customerController = require('../controller/customerController');
const router = require('express').Router();
const customerMiddleware = require('../middleware/customerMiddleware');

router.route('/register')
    .post(customerController.register)

router.route('/login')
    .post(customerController.login)

router.route('/logout')
    .get(customerMiddleware.auth, customerController.logout)

router.route('/auth')
    .get(customerMiddleware.auth, customerController.authenticate)


module.exports = router;