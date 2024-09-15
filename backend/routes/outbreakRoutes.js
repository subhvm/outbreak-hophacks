const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Outbreak = require('../models/OutbreakNo');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://disease.sh/v3/covid-19/countries');
    const outbreaks = response.data.map(country => ({
      location: country.country,
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
      disease: 'COVID-19',
      cases: country.cases,
      deaths: country.deaths,
      recovered: country.recovered,
      active_cases: country.active
    }));
    res.json(outbreaks);
  } catch (error) {
    console.error('Error fetching disease data:', error);
    res.status(500).json({ message: 'Error fetching disease data' });
  }
});






 
  
  module.exports = router;
