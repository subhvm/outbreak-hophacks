import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Map = () => {
  const [outbreaks, setOutbreaks] = useState([]);

  useEffect(() => {
    const fetchOutbreaks = async () => {
      const { data } = await axios.get('http://localhost:5000/api/outbreaks');
      setOutbreaks(data);
    };
    fetchOutbreaks();
  }, []);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {outbreaks.map((outbreak) => (
        <Marker key={outbreak._id} position={[outbreak.lat, outbreak.lng]}>
          <Popup>
            <h4>{outbreak.disease}</h4>
            <p><strong>Location:</strong> {outbreak.location}</p>
            <p><strong>Cases:</strong> {outbreak.cases}</p>
            <p><strong>Deaths:</strong> {outbreak.deaths}</p>
            <p><strong>Date Reported:</strong> {new Date(outbreak.dateReported).toLocaleDateString()}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
