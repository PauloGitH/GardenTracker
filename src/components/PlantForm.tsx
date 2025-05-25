import React, { useState, useEffect } from 'react';
import { Plant, PlantType, SunlightRequirement, SoilType, Season } from '../types';
import { X } from 'lucide-react';

interface PlantFormProps {
  plant: Plant | null;
  position?: { lat: number; lng: number };
  onSave: (plant: Plant) => void;
  onCancel: () => void;
}

const PlantForm: React.FC<PlantFormProps> = ({ 
  plant, 
  position, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Plant>({
    id: '',
    name: '',
    scientificName: '',
    type: PlantType.Other,
    description: '',
    imageUrl: '',
    position: { lat: 0, lng: 0 },
    plantedDate: new Date().toISOString().split('T')[0],
    wateringFrequency: 7,
    sunlight: SunlightRequirement.FullSun,
    soilType: SoilType.Loamy,
    height: 0,
    spread: 0,
    seasonalInfo: {},
    notes: ''
  });
  
  const [bloomingSeasons, setBloomingSeasons] = useState<Season[]>([]);
  const [harvestSeasons, setHarvestSeasons] = useState<Season[]>([]);
  const [dormantSeasons, setDormantSeasons] = useState<Season[]>([]);

  useEffect(() => {
    if (plant) {
      setFormData(plant);
      setBloomingSeasons(plant.seasonalInfo.bloomingSeason || []);
      setHarvestSeasons(plant.seasonalInfo.harvestSeason || []);
      setDormantSeasons(plant.seasonalInfo.dormantSeason || []);
    } else if (position) {
      setFormData(prev => ({
        ...prev,
        id: `plant-${Date.now()}`,
        position
      }));
    }
  }, [plant, position]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleSeasonToggle = (season: Season, type: 'blooming' | 'harvest' | 'dormant') => {
    if (type === 'blooming') {
      setBloomingSeasons(prev => 
        prev.includes(season) 
          ? prev.filter(s => s !== season) 
          : [...prev, season]
      );
    } else if (type === 'harvest') {
      setHarvestSeasons(prev => 
        prev.includes(season) 
          ? prev.filter(s => s !== season) 
          : [...prev, season]
      );
    } else {
      setDormantSeasons(prev => 
        prev.includes(season) 
          ? prev.filter(s => s !== season) 
          : [...prev, season]
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPlant: Plant = {
      ...formData,
      seasonalInfo: {
        ...(bloomingSeasons.length > 0 && { bloomingSeason: bloomingSeasons }),
        ...(harvestSeasons.length > 0 && { harvestSeason: harvestSeasons }),
        ...(dormantSeasons.length > 0 && { dormantSeason: dormantSeasons })
      }
    };
    
    onSave(updatedPlant);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] animate-slideUp max-w-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{plant ? 'Edit Plant' : 'Add New Plant'}</h2>
        <button 
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={onCancel}
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name</label>
            <input
              type="text"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {Object.values(PlantType).map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Planted Date</label>
            <input
              type="date"
              name="plantedDate"
              value={formData.plantedDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Watering Frequency (days)</label>
            <input
              type="number"
              name="wateringFrequency"
              value={formData.wateringFrequency}
              onChange={handleNumberChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sunlight</label>
            <select
              name="sunlight"
              value={formData.sunlight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {Object.values(SunlightRequirement).map(requirement => (
                <option key={requirement} value={requirement}>
                  {requirement.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {Object.values(SoilType).map(soil => (
                <option key={soil} value={soil}>{soil.charAt(0).toUpperCase() + soil.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleNumberChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spread (cm)</label>
          <input
            type="number"
            name="spread"
            value={formData.spread}
            onChange={handleNumberChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seasonal Information</label>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Blooming Seasons:</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(Season).map(season => (
                  <label 
                    key={`bloom-${season}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      bloomingSeasons.includes(season as Season)
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={bloomingSeasons.includes(season as Season)}
                      onChange={() => handleSeasonToggle(season as Season, 'blooming')}
                    />
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Harvest Seasons:</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(Season).map(season => (
                  <label 
                    key={`harvest-${season}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      harvestSeasons.includes(season as Season)
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={harvestSeasons.includes(season as Season)}
                      onChange={() => handleSeasonToggle(season as Season, 'harvest')}
                    />
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Dormant Seasons:</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(Season).map(season => (
                  <label 
                    key={`dormant-${season}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      dormantSeasons.includes(season as Season)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={dormantSeasons.includes(season as Season)}
                      onChange={() => handleSeasonToggle(season as Season, 'dormant')}
                    />
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {plant ? 'Update Plant' : 'Add Plant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantForm;
