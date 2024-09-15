import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../App.css';

const Map = () => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('COVID-19'); // Default selected disease
  const [globalStats, setGlobalStats] = useState({
    totalCases: 0,
    totalRecovered: 0,
    totalDeaths: 0,
    totalActive: 0
  });
  const [clickedStats, setClickedStats] = useState(null); // Start with null, no country clicked yet
  const [clickedLocation, setClickedLocation] = useState('Global'); // Default to "Global"

  const bounds = [
    [-85, -180],  // Southwest corner of the map (lat, lng)
    [85, 180]     // Northeast corner of the map (lat, lng)
  ];

  // Function to fetch disease data from the server
  const fetchDiseaseData = async (disease) => {
    try {
      let url = '';
      if (disease === 'Flu') {
        url = 'http://localhost:5000/api/flu-outbreaks';  // Fetch flu-specific data
      } else {
        url = `http://localhost:5000/api/outbreaks?disease=${disease}`;  // Fetch general disease data
      }
      const response = await axios.get(url);
      setOutbreaks(response.data);
    } catch (error) {
      console.error("Error fetching disease data:", error);
    }
  };

  // Fetch the default disease (COVID-19) on component mount
  useEffect(() => {
    fetchDiseaseData('COVID-19');
  }, []); // Empty dependency array ensures this only runs once after the component is mounted

  // Update data when selected disease changes
  useEffect(() => {
    fetchDiseaseData(selectedDisease); // Fetch new disease data when dropdown changes
  }, [selectedDisease]);

  // Filter outbreaks based on the selected disease
  const filteredOutbreaks = outbreaks.filter(outbreak => outbreak.disease === selectedDisease);

  // Update global statistics when filteredOutbreaks or selectedDisease changes
  useEffect(() => {
    if (filteredOutbreaks.length > 0) {
      const totalCases = filteredOutbreaks.reduce((sum, outbreak) => sum + (outbreak.cases || 0), 0);
      const totalRecovered = filteredOutbreaks.reduce((sum, outbreak) => sum + (outbreak.recovered || 0), 0);
      const totalDeaths = filteredOutbreaks.reduce((sum, outbreak) => sum + (outbreak.deaths || 0), 0);
      const totalActive = totalCases - totalRecovered - totalDeaths;

      setGlobalStats({ totalCases, totalRecovered, totalDeaths, totalActive });
    }
  }, [filteredOutbreaks, selectedDisease]);

  // Function to update stats on clicking a specific country marker
  const handleClick = (outbreak) => {
    const totalCases = outbreak.cases || 0;
    const totalRecovered = outbreak.recovered || 0;
    const totalDeaths = outbreak.deaths || 0;
    const totalActive = totalCases - totalRecovered - totalDeaths;

    setClickedStats({ totalCases, totalRecovered, totalDeaths, totalActive });
    setClickedLocation(outbreak.location); // Set clicked location
  };

  return (
    <div>
      {/* Dropdown and Stats Container */}
      <div className="dropdown-container">
        <select
          value={selectedDisease}
          onChange={e => setSelectedDisease(e.target.value)}
          className="dropdown"
        >
          <option value="COVID-19">COVID-19</option>
          <option value="Flu">Flu</option>
          <option value="Measles">Measles</option>
          <option value="Ebola">Ebola</option>
          <option value="Dengue">Dengue</option>
        </select>

        <div className="stats">
          <div>Location: {clickedLocation}</div>
          <div>Total Cases: {clickedStats ? clickedStats.totalCases : globalStats.totalCases}</div>
          <div>Total Recovered: {clickedStats ? clickedStats.totalRecovered : globalStats.totalRecovered}</div>
          <div>Total Deaths: {clickedStats ? clickedStats.totalDeaths : globalStats.totalDeaths}</div>
          <div>Total Active: {clickedStats ? clickedStats.totalActive : globalStats.totalActive}</div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[35, -30]} zoom={3} minZoom={2} maxBounds={bounds}
        maxBoundsViscosity={1.0} scrollWheelZoom={false} maxZoom={8}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filteredOutbreaks.map((outbreak, index) => (
          <CircleMarker
            key={index}
            center={[outbreak.lat, outbreak.lng]}   // Latitude/longitude from API
            radius={6}                             // Marker size can vary based on severity
            fillColor="red"                         // Epicenter dot color
            color="red"
            weight={1}
            fillOpacity={0.5}                      // Opacity of the dot
            eventHandlers={{
              click: () => handleClick(outbreak)  // Update stats on click
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div>
                <h4>{outbreak.disease}</h4>
                <p><strong>Location:</strong> {outbreak.location}</p>
                <p><strong>Total Cases:</strong> {outbreak.cases}</p>
                <p><strong>Active Cases:</strong> {outbreak.active_cases}</p>
                <p><strong>Click for STATS</strong> </p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
