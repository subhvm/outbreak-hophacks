import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker ,Tooltip} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';



  



const Map = () => {
  const [outbreaks, setOutbreaks] = useState([]);

 
  const bounds = [
    [-85, -180],  // Southwest corner of the map (lat, lng)
    [85, 180]     // Northeast corner of the map (lat, lng)
  ];

  useEffect(() => {
    const fetchOutbreaks = async () => {

        // added now
        try {
            const { data } = await axios.get('http://localhost:5000/api/outbreaks');
           
            setOutbreaks(data);
          } catch (error) {
            console.error("Error fetching outbreak data:", error);
          }
    };
    fetchOutbreaks();
  }, []);

  return (
    // now

    <MapContainer center={[35, -30]} zoom={3} minZoom={2}  maxBounds={bounds} 
    maxBoundsViscosity={1.0}  scrollWheelZoom={false} maxZoom={8} style={{ height: '600px', width: '100%' }}>
   
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


    

    {outbreaks.map((outbreak, index) => (
        <CircleMarker
          key={index}
          center={[outbreak.lat, outbreak.lng]}   // Use lat/lng from API
          radius={6}                             // Size of the dot (can vary based on severity)
          fillColor="red"                         // Color of the epicenter dot
          color="red"
          weight={1}
          fillOpacity={0.5}                       // Opacity of the dot
        >
          {/* Tooltip will appear only on hover, remove 'permanent' */}
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div>
              <h4>{outbreak.disease}</h4>
              <p><strong>Location:</strong> {outbreak.location}</p>
              <p><strong>Total Cases:</strong> {outbreak.cases}</p>
              <p><strong>Active Cases:</strong> {outbreak.active_cases}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

  </MapContainer>
  );
};

export default Map;
