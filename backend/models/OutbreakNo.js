const mongoose = require('mongoose');

const outbreakSchema = mongoose.Schema({
  location: String,
  disease: String,
  cases: Number,
  deaths: Number,
  lat: Number,
  lng: Number,
  dateReported: {
    type: Date,
    default: Date.now,
  },
});

const Outbreak = mongoose.model('Outbreak', outbreakSchema);

module.exports = Outbreak;
