const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Outbreak = require('../models/OutbreakNo');
const router = express.Router();

router.get('/', (req, res) => {
    // Mock outbreak data for testing
    const outbreaks = [
      {
        location: "New York",
        lat: 40.7128,
        lng: -74.0060,
        disease: "COVID-19",
        cases: 123456,
        active_cases: 23456
      },
      {
        location: "London",
        lat: 51.5074,
        lng: -0.1278,
        disease: "Flu",
        cases: 78900,
        active_cases: 12000
      },
      {
        location: "Paris",
        lat: 48.8566,
        lng: 2.3522,
        disease: "Measles",
        cases: 5400,
        active_cases: 1300
      }
    ];
  
    // Send mock data as the API response
    res.json(outbreaks);
  });
  

 
  
  module.exports = router;
