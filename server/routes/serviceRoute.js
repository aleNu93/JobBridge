const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const { createService, getAll, getById, updateService, deleteService, uploadServiceImages } = require('../controllers/serviceController');

router.post('/', auth, role('freelancer'), createService);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', auth, role('freelancer'), updateService);
router.delete('/:id', auth, role('freelancer'), deleteService);
router.post('/:id/images', auth, role('freelancer'), upload.array('images', 5), uploadServiceImages);


module.exports = router;