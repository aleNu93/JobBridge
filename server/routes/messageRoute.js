const router = require('express').Router();
const auth = require('../middleware/auth');
const { sendMessage, getMessages, getMyConversations } = require('../controllers/messageController');

router.post('/', auth, sendMessage);
router.get('/conversations', auth, getMyConversations);
router.get('/:contractId', auth, getMessages);

module.exports = router;