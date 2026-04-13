const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, updateProfile, uploadProfilePicture, getPublicProfile } = require('../controllers/userController');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.post('/me/picture', auth, upload.single('picture'), uploadProfilePicture);
router.get('/:id', auth, getPublicProfile);

module.exports = router;