const movieController = require('../controller/movieController');
const mailController = require('../controller/mailController');
const router = require('express').Router();

router.route('/playing')
    .get(movieController.playing)

router.route('/upcoming')
    .get(movieController.upcoming)

router.route('/date')
    .post(movieController.date)

router.route('/theater')
    .post(movieController.theater)

router.route('/time')
    .post(movieController.time)

router.route('/scheduleId')
    .post(movieController.scheduleId)

router.route('/book')
    .post(movieController.book, mailController.sendMail)

router.route('/seats')  // 특정 스케줄에 해당하는 좌석 정보
    .post(movieController.seats)

router.route('/cumulativeAudiences')
    .post(movieController.cumulativeAudiences)

router.route('/numberOfBookers')
    .post(movieController.numberOfBookers)

router.route('/historyBooked')
    .post(movieController.historyBooked)

router.route('/historyCanceled')
    .post(movieController.historyCanceled)

router.route('/historyWatched')
    .post(movieController.historyWatched)

router.route('/cancel')
    .post(movieController.cancel)

router.route('/genderRatio')
    .post(movieController.genderRatio)

router.route('/ticketingRank')
    .post(movieController.ticketingRank)

router.route('/moviesWithDate')
    .post(movieController.moviesWithDate)

router.route('/moviesWithTitle')
    .post(movieController.moviesWithTitle)
    
module.exports = router;