import React from 'react';
import { Plant, PlantType, SunlightRequirement, SoilType, Season } from '../types';
import { Droplets, Sun, Shovel, Calendar, Ruler, X, Edit, Trash2 } from 'lucide-react';

interface PlantDetailProps {
  plant: Plant | null;
  onClose: () => void;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
}

const PlantDetail: React.FC<PlantDetailProps> = ({ plant, onClose, onEdit, onDelete }) => {
  if (!plant) return null;

  const getSunlightIcon = (sunlight: SunlightRequirement) => {
    switch (sunlight) {
      case SunlightRequirement.FullSun:
        return <div className="flex items-center"><Sun className="text-yellow-500 mr-1" size={16} /> Full Sun</div>;
      case SunlightRequirement.PartialShade:
        return <div className="flex items-center"><Sun className="text-yellow-400 mr-1" size={16} /> Partial Shade</div>;
      case SunlightRequirement.FullShade:
        return <div className="flex items-center"><Sun className="text-gray-400 mr-1" size={16} /> Full Shade</div>;
    }
  };

  const getPlantTypeLabel = (type: PlantType) => {
    const typeColors = {
      [PlantType.Tree]: 'bg-green-100 text-green-800',
      [PlantType.Shrub]: 'bg-emerald-100 text-emerald-800',
      [PlantType.Flower]: 'bg-pink-100 text-pink-800',
      [PlantType.Vegetable]: 'bg-orange-100 text-orange-800',
      [PlantType.Fruit]: 'bg-red-100 text-red-800',
      [PlantType.Herb]: 'bg-blue-100 text-blue-800',
      [PlantType.Grass]: 'bg-lime-100 text-lime-800',
      [PlantType.Other]: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeColors[type as PlantType]}`}>
        {type}
      </span>
    );
  };

  const getSeasonLabel = (season: Season) => {
    const seasonColors = {
      [Season.Spring]: 'bg-green-100 text-green-800',
      [Season.Summer]: 'bg-yellow-100 text-yellow-800',
      [Season.Fall]: 'bg-orange-100 text-orange-800',
      [Season.Winter]: 'bg-blue-100 text-blue-800',
    };

    return (
      <span key={season} className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-1 ${seasonColors[season as Season]}`}>
        {season}
      </span>
    );
  };

  const plantedDate = new Date(plant.plantedDate).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full animate-slideUp">
      <div className="relative h-48">
        <img 
          src={plant.imageUrl} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            className="bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => onEdit(plant)}
            aria-label="Edit plant"
          >
            <Edit size={18} />
          </button>
          <button 
            className="bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 text-red-500 transition-colors"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${plant.name}?`)) {
                onDelete(plant.id);
              }
            }}
            aria-label="Delete plant"
          >
            <Trash2 size={18} />
          </button>
          <button 
            className="bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold">{plant.name}</h2>
            <p className="text-sm italic text-gray-600 mb-1">{plant.scientificName}</p>
          </div>
          {getPlantTypeLabel(plant.type as PlantType)}
        </div>
        
        <p className="text-gray-700 mb-4">{plant.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm">
            <Droplets className="text-blue-500 mr-2" size={16} />
            Every {plant.wateringFrequency} days
          </div>
          <div className="flex items-center text-sm">
            {getSunlightIcon(plant.sunlight as SunlightRequirement)}
          </div>
          <div className="flex items-center text-sm">
            <Shovel className="text-amber-700 mr-2" size={16} />
            {plant.soilType} soil
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="text-indigo-500 mr-2" size={16} />
            Planted: {plantedDate}
          </div>
          <div className="flex items-center text-sm">
            <Ruler className="text-gray-500 mr-2" size={16} />
            {plant.height}cm × {plant.spread}cm
          </div>
        </div>
        
        {plant.seasonalInfo.bloomingSeason && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Blooming Seasons:</p>
            <div className="flex flex-wrap">
              {plant.seasonalInfo.bloomingSeason.map(season => 
                getSeasonLabel(season as Season)
              )}
            </div>
          </div>
        )}
        
        {plant.seasonalInfo.harvestSeason && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Harvest Seasons:</p>
            <div className="flex flex-wrap">
              {plant.seasonalInfo.harvestSeason.map(season => 
                getSeasonLabel(season as Season)
              )}
            </div>
          </div>
        )}
        
        {plant.notes && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-gray-800">{plant.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetail;
