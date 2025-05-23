import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Plant, Position } from '../types';
import { Move, ZoomIn, ZoomOut } from 'lucide-react';

interface GardenMapProps {
  plants: Plant[];
  dimensions: { width: number; height: number };
  selectedPlant: Plant | null;
  onSelectPlant: (plant: Plant) => void;
  onUpdatePlantPosition: (plantId: string, position: Position) => void;
  onAddPlantAtPosition: (position: Position) => void;
}

// Custom marker icons for different plant types
const createPlantIcon = (type: string, selected: boolean) => {
  const size = selected ? 32 : 24;
  return L.divIcon({
    className: `plant-marker ${type} ${selected ? 'selected' : ''}`,
    html: `<div class="w-${size} h-${size} rounded-full ${
      selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
    } bg-${
      type === 'tree' ? 'emerald-700' :
      type === 'shrub' ? 'emerald-600' :
      type === 'flower' ? 'pink-600' :
      type === 'vegetable' ? 'orange-600' :
      type === 'herb' ? 'teal-500' :
      type === 'fruit' ? 'red-600' :
      'gray-600'
    }"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Custom map controls component
const MapControls = ({ onReset }: { onReset: () => void }) => {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
      <button
        onClick={() => map.zoomIn()}
        className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
      >
        <ZoomIn className="h-5 w-5 text-gray-700" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
      >
        <ZoomOut className="h-5 w-5 text-gray-700" />
      </button>
      <button
        onClick={onReset}
        className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
      >
        <Move className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
};

// Map click handler component
const MapClickHandler = ({ onAddPlantAtPosition }: { onAddPlantAtPosition: (position: Position) => void }) => {
  useMapEvents({
    click: (e) => {
      onAddPlantAtPosition({ x: e.latlng.lat, y: e.latlng.lng });
    },
  });
  return null;
};

const GardenMap: React.FC<GardenMapProps> = ({
  plants,
  dimensions,
  selectedPlant,
  onSelectPlant,
  onUpdatePlantPosition,
  onAddPlantAtPosition
}) => {
  const [center] = useState<[number, number]>([dimensions.height/2, dimensions.width/2]);
  const [zoom] = useState(17);

  // Convert garden dimensions to map bounds
  const bounds = L.latLngBounds(
    [0, 0],
    [dimensions.height, dimensions.width]
  );

  const handleMarkerDragEnd = (plantId: string, e: L.DragEndEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    onUpdatePlantPosition(plantId, { x: position.lat, y: position.lng });
  };

  return (
    <div className="h-[600px] bg-white shadow-lg rounded-lg overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={zoom}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {plants.map(plant => (
          <Marker
            key={plant.id}
            position={[plant.position.x, plant.position.y]}
            icon={createPlantIcon(plant.type, selectedPlant?.id === plant.id)}
            draggable={true}
            eventHandlers={{
              dragend: (e) => handleMarkerDragEnd(plant.id, e),
              click: () => onSelectPlant(plant)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{plant.name}</h3>
                <p className="text-sm italic">{plant.species}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapControls onReset={() => {}} />
        <MapClickHandler onAddPlantAtPosition={onAddPlantAtPosition} />
      </MapContainer>

      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-2 text-xs text-gray-500 border-t">
        Plants: {plants.length} | Click to add or select plants | Drag markers to move plants
      </div>
    </div>
  );
};

export default GardenMap;