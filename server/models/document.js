const mongoose = require('mongoose');

const childSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String },
  url: { type: String },
  description: { type: String }
}, { _id: false }); 

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String },
  url: { type: String },
  children: [childSchema],
  description: { type: String }
});

module.exports = mongoose.model('Document', documentSchema);
