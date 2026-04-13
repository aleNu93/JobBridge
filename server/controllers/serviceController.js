const Service = require('../models/Service');
const Rating = require('../models/Rating');
const Contract = require('../models/Contract');

const createService = async (req, res) => {
  try {
    const { title, description, category, price, currency, tax, priceUnit, deliveryDays, revisionsIncluded, images } = req.body;

    const service = await Service.create({
      freelancerId: req.user.id,
      title,
      description,
      category,
      price,
      currency,
      tax,
      priceUnit,
      deliveryDays,
      revisionsIncluded,
      images
    });

    res.status(201).json(service);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const { category, priceUnit, maxPrice, minPrice, maxDelivery, sort } = req.query;

    const filter = { status: 'active' };

    if (category) {
      filter.category = category;
    }
    if (priceUnit) {
      filter.priceUnit = priceUnit;
    }
    if (maxPrice || minPrice) {
      filter.price = {};
      if (maxPrice) filter.price.$lte = Number(maxPrice);
      if (minPrice) filter.price.$gte = Number(minPrice);
    }
    if (maxDelivery) {
      filter.deliveryDays = { $lte: Number(maxDelivery) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'delivery_asc') sortOption = { deliveryDays: 1 };

    let services = await Service.find(filter)
      .sort(sortOption)
      .populate('freelancerId', 'name profilePicture');

    // For rating sort, we need to calculate averages
    if (sort === 'rating_desc') {
      const servicesWithRatings = await Promise.all(
        services.map(async (service) => {
          const contracts = await Contract.find({ serviceId: service._id });
          const contractIds = contracts.map(c => c._id);
          const ratings = await Rating.find({
            contractId: { $in: contractIds },
            toUserId: service.freelancerId._id
          });
          const avg = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
            : 0;
          return { ...service.toObject(), avgRating: avg, ratingCount: ratings.length };
        })
      );

      servicesWithRatings.sort((a, b) => b.avgRating - a.avgRating);
      return res.json(servicesWithRatings);
    }

    res.json(services);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancerId', 'name profilePicture skills');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = [
      'title', 'description', 'category', 'price', 'currency',
      'tax', 'priceUnit', 'deliveryDays', 'revisionsIncluded', 'images', 'status'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updatedService);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadServiceImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    service.images = [...service.images, ...newImages];
    await service.save();

    res.json(service);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: 'Service deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createService, getAll, getById, updateService, deleteService, uploadServiceImages };
