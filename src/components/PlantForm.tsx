import React, { useState } from 'react';
import { X, Check, Upload } from 'lucide-react';
import { Plant, PlantType, Season, HealthStatus, Position } from '../types';

interface PlantFormProps {
  onSave: (plant: Omit<Plant, 'id'>) => void;
  onCancel: () => void;
  initialPosition?: Position;
}

const PlantForm: React.FC<PlantFormProps> = ({
  onSave,
  onCancel,
  initialPosition
}) => {
  const [formData, setFormData] = useState<Omit<Plant, 'id'>>({
    name: '',
    species: '',
    type: PlantType.Flower,
    position: initialPosition || { x: 0, y: 0 },
    plantedDate: new Date().toISOString().split('T')[0],
    notes: '',
    healthStatus: HealthStatus.Good,
    seasonality: [Season.Spring, Season.Summer],
    image: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSeasonChange = (season: Season) => {
    const newSeasons = formData.seasonality.includes(season)
      ? formData.seasonality.filter(s => s !== season)
      : [...formData.seasonality, season];
    
    setFormData(prev => ({
      ...prev,
      seasonality: newSeasons
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
      <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add New Plant</h2>
        <button 
          onClick={onCancel}
          className="p-1.5 rounded-full bg-white text-gray-600 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plant Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species*
          </label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plant Type*
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.values(PlantType).map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Health Status*
          </label>
          <select
            name="healthStatus"
            value={formData.healthStatus}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.values(HealthStatus).map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Planted*
          </label>
          <input
            type="date"
            name="plantedDate"
            value={formData.plantedDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Watered
          </label>
          <input
            type="date"
            name="lastWatered"
            value={formData.lastWatered || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Fertilized
          </label>
          <input
            type="date"
            name="lastFertilized"
            value={formData.lastFertilized || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seasonality*
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Season).map(season => (
              <button
                key={season}
                type="button"
                onClick={() => handleSeasonChange(season as Season)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  formData.seasonality.includes(season as Season)
                    ? season === Season.Spring
                      ? 'bg-green-500 text-white'
                      : season === Season.Summer
                      ? 'bg-yellow-500 text-white'
                      : season === Season.Fall
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <div className="flex">
            <input
              type="text"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded-r-md border border-gray-300 border-l-0 hover:bg-gray-300"
              title="Upload image"
            >
              <Upload className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use a URL to an image or leave blank
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
          >
            <Check className="h-4 w-4 mr-1" />
            Add Plant
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantForm;