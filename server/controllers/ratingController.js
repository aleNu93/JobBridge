const Rating = require('../models/Rating');
const Contract = require('../models/Contract');
const Service = require('../models/Service');

const createRating = async (req, res) => {
  try {
    const { contractId, score, comment } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed contracts' });
    }

    const isClient = contract.clientId.toString() === req.user.id;
    const isFreelancer = contract.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const toUserId = isClient
      ? contract.freelancerId
      : contract.clientId;

    const existingRating = await Rating.findOne({
      contractId,
      fromUserId: req.user.id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You already rated this contract' });
    }

    const rating = await Rating.create({
      contractId,
      fromUserId: req.user.id,
      toUserId,
      score,
      comment
    });

    res.status(201).json(rating);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ toUserId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('fromUserId', 'name profilePicture')
      .populate('toUserId', 'name')
      .populate('contractId', 'projectName');

    const total = ratings.length;
    const average = total > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / total).toFixed(1)
      : 0;

    res.json({
      ratings,
      average: Number(average),
      total
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getServiceRatings = async (req, res) => {
  try {
    const contracts = await Contract.find({ serviceId: req.params.serviceId });
    const contractIds = contracts.map(c => c._id);

    // Get the freelancer ID from the service
    const service = await Service.findById(req.params.serviceId);
    
    const filter = { contractId: { $in: contractIds } };
    
    // Only show ratings TO the freelancer (from PYMEs reviewing the service)
    if (service) {
      filter.toUserId = service.freelancerId;
    }

    const ratings = await Rating.find(filter)
      .sort({ createdAt: -1 })
      .populate('fromUserId', 'name profilePicture')
      .populate('toUserId', 'name');

    const total = ratings.length;
    const average = total > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / total).toFixed(1)
      : 0;

    res.json({
      ratings,
      average: Number(average),
      total
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createRating, getUserRatings, getServiceRatings };