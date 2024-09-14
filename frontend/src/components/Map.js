import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker ,Tooltip} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Map = () => {
  const [outbreaks, setOutbreaks] = useState([]);

  useEffect(() => {
    const fetchOutbreaks = async () => {

        // added now
        try {
            const { data } = await axios.get('http://localhost:5000/api/outbreaks');
            console.log(data);
            setOutbreaks(data);
          } catch (error) {
            console.error("Error fetching outbreak data:", error);
          }
    };
    fetchOutbreaks();
  }, []);

  return (
    // now

    <MapContainer center={[20, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    {outbreaks.map((outbreak, index) => (
      <Marker key={index} position={[outbreak.lat || 0, outbreak.lng || 0]}>
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
          <div>
            <h4>{outbreak.disease}</h4>
            <p><strong>Location:</strong> {outbreak.location}</p>
            <p><strong>Total Cases:</strong> {outbreak.cases}</p>
            <p><strong>Active Cases:</strong> {outbreak.active_cases}</p>
          </div>
        </Tooltip>
      </Marker>
    ))}
  </MapContainer>
  );
};

export default Map;
