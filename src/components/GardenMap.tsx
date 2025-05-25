import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { Plant } from '../types';
import PlantMarker from './PlantMarker';

interface GardenMapProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onAddPlant: (position: { lat: number; lng: number }) => void;
  onMovePlant?: (id: string, position: { lat: number; lng: number }) => void;
  editMode: boolean;
}

const GardenMap: React.FC<GardenMapProps> = ({ 
  plants, 
  onSelectPlant, 
  onAddPlant,
  onMovePlant,
  editMode
}) => {
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (editMode) {
          onAddPlant({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      },
    });
    return null;
  };

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={17} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {plants.map((plant) => (
          <PlantMarker
            key={plant.id}
            plant={plant}
            onClick={() => onSelectPlant(plant)}
            onMove={onMovePlant}
            draggable={editMode}
          />
        ))}
        <MapEvents />
      </MapContainer>
      
      {editMode && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-md text-sm text-gray-700 pointer-events-auto animate-pulse">
            Click on the map to add a new plant or drag existing markers to move them
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenMap