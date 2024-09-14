const express = require('express');
const axios = require('axios');
const Outbreak = require('../models/OutbreakNo');
const router = express.Router();

// Fetch outbreaks from a public API or store manually in MongoDB
router.get('/', async (req, res) => {
  try {
    const outbreaks = await Outbreak.find();
    res.json(outbreaks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
