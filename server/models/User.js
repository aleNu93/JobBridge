const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['freelancer', 'pyme'],
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  lastname1: {
    type: String,
    trim: true
  },

  lastname2: {
    type: String,
    trim: true
  },

  cedula: {
    type: String,
    trim: true
  },

  phone: {
    type: String,
    trim: true
  },

  birthDate: {
    type: Date
  },

  company: {
    name: { type: String, trim: true },
    cedulaJuridica: { type: String, trim: true },
    address: { type: String, trim: true },
    industry: { type: String, trim: true },
    size: { type: String, trim: true }
  },

  skills: [{
    type: String,
    trim: true
  }],

  profilePicture: {
    type: String,
    default: ''
  },
  
  active: {
    type: Boolean,
    default: true
  }
}, 

{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);