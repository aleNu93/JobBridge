const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { createContract, getMyContracts, getContractById, updateContractStatus, updateMilestones } = require('../controllers/contractController');

router.post('/', auth, role('pyme'), createContract);
router.get('/', auth, getMyContracts);
router.get('/:id', auth, getContractById);
router.put('/:id/status', auth, updateContractStatus);
router.put('/:id/milestones', auth, role('freelancer'), updateMilestones);

module.exports = router;