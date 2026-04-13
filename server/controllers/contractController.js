const Contract = require('../models/Contract');
const Service = require('../models/Service');

const createContract = async (req, res) => {
  try {
    const { serviceId, projectName, description, contactEmail, notes, deadline } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.status !== 'active') {
      return res.status(400).json({ message: 'Service is not available' });
    }

    const platformFee = service.price * 0.05;
    const total = service.price + platformFee;

    const contract = await Contract.create({
      serviceId,
      clientId: req.user.id,
      freelancerId: service.freelancerId,
      projectName,
      description,
      contactEmail,
      notes,
      deadline,
      price: service.price,
      platformFee,
      total
    });

    res.status(201).json(contract);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyContracts = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (req.user.role === 'pyme') {
      filter.clientId = req.user.id;
    } else {
      filter.freelancerId = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    const contracts = await Contract.find(filter)
      .sort({ createdAt: -1 })
      .populate('serviceId', 'title category')
      .populate('clientId', 'name email profilePicture')
      .populate('freelancerId', 'name email profilePicture');

    res.json(contracts);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('serviceId', 'title description category deliveryDays')
      .populate('clientId', 'name email phone profilePicture')
      .populate('freelancerId', 'name email phone profilePicture skills');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const isClient = contract.clientId._id.toString() === req.user.id;
    const isFreelancer = contract.freelancerId._id.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(contract);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateContractStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const isClient = contract.clientId.toString() === req.user.id;
    const isFreelancer = contract.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedTransitions = {
      pyme: {
        requested: ['cancelled'],
        in_progress: ['cancelled'],
        completed: []
      },
      freelancer: {
        requested: ['accepted', 'cancelled'],
        accepted: ['in_progress'],
        in_progress: ['completed']
      }
    };

    const role = req.user.role;
    const currentStatus = contract.status;

    if (!allowedTransitions[role] || !allowedTransitions[role][currentStatus]) {
      return res.status(400).json({ message: 'Cannot change status from current state' });
    }

    if (!allowedTransitions[role][currentStatus].includes(status)) {
      return res.status(400).json({ message: `Cannot change from ${currentStatus} to ${status}` });
    }

    contract.status = status;

    if (status === 'accepted') {
      contract.startDate = new Date();
    }
    if (status === 'completed') {
      contract.endDate = new Date();
    }

    await contract.save();

    res.json(contract);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMilestones = async (req, res) => {
  try {
    const { milestones } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the freelancer can update milestones' });
    }

    contract.milestones = milestones;
    await contract.save();

    res.json(contract);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createContract, getMyContracts, getContractById, updateContractStatus, updateMilestones };