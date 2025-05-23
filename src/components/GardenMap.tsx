import React, { useState, useRef, useEffect } from 'react';
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

const GardenMap: React.FC<GardenMapProps> = ({
  plants,
  dimensions,
  selectedPlant,
  onSelectPlant,
  onUpdatePlantPosition,
  onAddPlantAtPosition
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPlant, setDraggedPlant] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Handle plant drag and drop
  const handlePlantMouseDown = (e: React.MouseEvent, plantId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return; // Only left mouse button
    
    setDraggedPlant(plantId);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedPlant || !dragStart || !mapRef.current) return;
    
    const plant = plants.find(p => p.id === draggedPlant);
    if (!plant) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    
    const newX = Math.max(0, Math.min(dimensions.width, plant.position.x + dx));
    const newY = Math.max(0, Math.min(dimensions.height, plant.position.y + dy));
    
    onUpdatePlantPosition(draggedPlant, { x: newX, y: newY });
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedPlant(null);
    setDragStart(null);
    setIsPanning(false);
  };
  
  const handleMapClick = (e: React.MouseEvent) => {
    if (isDragging || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / scale) - pan.x;
    const y = ((e.clientY - rect.top) / scale) - pan.y;
    
    // Check if clicked on a plant
    const clickedPlant = plants.find(plant => {
      const distance = Math.sqrt(
        Math.pow(plant.position.x - x, 2) + 
        Math.pow(plant.position.y - y, 2)
      );
      return distance < 20; // Adjust the radius as needed
    });
    
    if (clickedPlant) {
      onSelectPlant(clickedPlant);
    } else {
      // Add a new plant at this position
      onAddPlantAtPosition({ x, y });
    }
  };
  
  // Handle map panning
  const handleMapMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1 && !e.ctrlKey) return; // Middle mouse button or Ctrl+Left click
    e.preventDefault();
    
    setIsPanning(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !dragStart) return;
    
    setPan({
      x: pan.x + (e.clientX - dragStart.x) / scale,
      y: pan.y + (e.clientY - dragStart.y) / scale
    });
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // Handle zoom
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev * 1.1, 3));
    } else {
      setScale(prev => Math.max(prev / 1.1, 0.5));
    }
  };
  
  useEffect(() => {
    // Reset pan and zoom when dimensions change
    setPan({ x: 0, y: 0 });
    setScale(1);
  }, [dimensions]);
  
  const getPlantSize = (type: string) => {
    switch (type) {
      case 'tree':
        return 30;
      case 'shrub':
        return 24;
      case 'flower':
        return 18;
      case 'vegetable':
      case 'herb':
        return 16;
      default:
        return 20;
    }
  };
  
  const getPlantColor = (type: string) => {
    switch (type) {
      case 'tree':
        return '#2F855A'; // emerald-700
      case 'shrub':
        return '#38A169'; // green-600
      case 'flower':
        return '#D53F8C'; // pink-600
      case 'vegetable':
        return '#DD6B20'; // orange-600
      case 'herb':
        return '#38B2AC'; // teal-500
      case 'fruit':
        return '#E53E3E'; // red-600
      default:
        return '#718096'; // gray-600
    }
  };
  
  return (
    <div className="h-[600px] bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
        >
          <ZoomIn className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
        >
          <ZoomOut className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={() => setPan({ x: 0, y: 0 })}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
        >
          <Move className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`rounded-full p-2 shadow transition-colors ${
            showGrid ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="h-5 w-5 grid grid-cols-2 gap-0.5">
            <div className="border border-current rounded-sm"></div>
            <div className="border border-current rounded-sm"></div>
            <div className="border border-current rounded-sm"></div>
            <div className="border border-current rounded-sm"></div>
          </div>
        </button>
      </div>
      
      <div
        ref={mapRef}
        className="relative w-full h-full overflow-hidden cursor-move"
        onMouseDown={handleMapMouseDown}
        onMouseMove={(e) => {
          handleMapMouseMove(e);
          handleMouseMove(e);
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleMapClick}
        onWheel={handleWheel}
      >
        <div 
          className="absolute inset-0"
          style={{
            transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '0 0',
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            backgroundImage: showGrid ? 'linear-gradient(to right, rgba(0, 128, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 128, 0, 0.1) 1px, transparent 1px)' : 'none',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Garden background */}
          <div className="absolute inset-0 bg-emerald-100 border-2 border-emerald-300 rounded-lg">
            {/* Grass texture */}
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}
            ></div>
          </div>
          
          {/* Plants */}
          {plants.map(plant => (
            <div
              key={plant.id}
              className={`absolute rounded-full transition-all duration-200 ${
                selectedPlant?.id === plant.id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
              }`}
              style={{
                left: `${plant.position.x}px`,
                top: `${plant.position.y}px`,
                width: `${getPlantSize(plant.type)}px`,
                height: `${getPlantSize(plant.type)}px`,
                backgroundColor: getPlantColor(plant.type),
                transform: `translate(-50%, -50%) ${
                  selectedPlant?.id === plant.id ? 'scale(1.1)' : 'scale(1)'
                }`,
                cursor: 'pointer',
                zIndex: selectedPlant?.id === plant.id ? 10 : 1
              }}
              onMouseDown={(e) => handlePlantMouseDown(e, plant.id)}
            >
              {/* Plant icon or image */}
              {plant.image && (
                <div 
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    backgroundImage: `url(${plant.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
              )}
              
              {/* Plant name tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {plant.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-2 text-xs text-gray-500 border-t">
        Scale: {Math.round(scale * 100)}% | Plants: {plants.length} | Click to add or select plants
      </div>
    </div>
  );
};

export default GardenMap;