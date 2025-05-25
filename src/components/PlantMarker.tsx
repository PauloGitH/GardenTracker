import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Plant, PlantType } from '../types';

interface PlantMarkerProps {
  plant: Plant;
  onClick: () => void;
  onMove?: (id: string, position: { lat: number; lng: number }) => void;
  draggable?: boolean;
}

const PlantMarker: React.FC<PlantMarkerProps> = ({ plant, onClick, onMove, draggable = false }) => {
  const getIconColor = (type: PlantType): string => {
    switch (type) {
      case PlantType.Tree: return 'green';
      case PlantType.Flower: return 'pink';
      case PlantType.Vegetable: return 'orange';
      case PlantType.Fruit: return 'red';
      case PlantType.Herb: return 'blue';
      case PlantType.Shrub: return 'darkgreen';
      case PlantType.Grass: return 'greenyellow';
      default: return 'gray';
    }
  };
  
  const getMarkerIcon = (type: PlantType) => {
    const color = getIconColor(type);
    
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const handleDragEnd = (e: any) => {
    if (onMove) {
      const latLng = e.target.getLatLng();
      onMove(plant.id, { lat: latLng.lat, lng: latLng.lng });
    }
  };

  return (
    <Marker 
      position={[plant.position.lat, plant.position.lng]} 
      icon={getMarkerIcon(plant.type as PlantType)}
      draggable={draggable}
      eventHandlers={{
        click: onClick,
        dragend: handleDragEnd
      }}
    >
      <Popup>
        <div className="text-center">
          <h3 className="font-semibold">{plant.name}</h3>
          <p className="text-xs italic">{plant.scientificName}</p>
          {draggable && (
            <p className="text-xs text-gray-500 mt-1">Drag to move</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default PlantMarker