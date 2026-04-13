const Message = require('../models/Message');
const Contract = require('../models/Contract');

const sendMessage = async (req, res) => {
  try {
    const { contractId, text } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const isClient = contract.clientId.toString() === req.user.id;
    const isFreelancer = contract.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const receiverId = isClient
      ? contract.freelancerId
      : contract.clientId;

    const message = await Message.create({
      contractId,
      senderId: req.user.id,
      receiverId,
      text
    });

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const isClient = contract.clientId.toString() === req.user.id;
    const isFreelancer = contract.freelancerId.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ contractId: req.params.contractId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name profilePicture');

    // Mark received messages as read
    await Message.updateMany(
      { contractId: req.params.contractId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const filter = req.user.role === 'pyme'
      ? { clientId: req.user.id }
      : { freelancerId: req.user.id };

    const contracts = await Contract.find(filter)
      .populate('serviceId', 'title')
      .populate('clientId', 'name profilePicture')
      .populate('freelancerId', 'name profilePicture');

    const conversations = [];

    for (const contract of contracts) {
      const lastMessage = await Message.findOne({ contractId: contract._id })
        .sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({
        contractId: contract._id,
        receiverId: req.user.id,
        read: false
      });

      conversations.push({
        contract,
        lastMessage,
        unreadCount
      });
    }

    conversations.sort((a, b) => {
      const dateA = a.lastMessage ? a.lastMessage.createdAt : a.contract.createdAt;
      const dateB = b.lastMessage ? b.lastMessage.createdAt : b.contract.createdAt;
      return dateB - dateA;
    });

    res.json(conversations);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, getMyConversations };