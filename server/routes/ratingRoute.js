const router = require('express').Router();
const auth = require('../middleware/auth');
const { createRating, getUserRatings, getServiceRatings } = require('../controllers/ratingController');

router.post('/', auth, createRating);
router.get('/user/:userId', getUserRatings);
router.get('/service/:serviceId', getServiceRatings);

module.exports = router;