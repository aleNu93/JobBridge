const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Diseño',
      'Programación',
      'Marketing',
      'Redacción',
      'Video',
      'Fotografía',
      'Traducción',
      'Consultoría',
      'Contabilidad',
      'Legal',
      'Educación',
      'Música y Audio',
      'Arquitectura',
      'Soporte TI',
      'Redes Sociales'
    ],
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  tax: {
    type: Number,
    default: 0
  },
  priceUnit: {
    type: String,
    enum: ['project', 'hour', 'package'],
    default: 'project'
  },
  deliveryDays: {
    type: Number,
    required: true,
    min: 1
  },
  revisionsIncluded: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],

  status: {
    type: String,
    enum: ['active', 'draft', 'paused', 'pending_approval'],
    default: 'active'
  },
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);