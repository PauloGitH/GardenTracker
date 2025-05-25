import React, { useState } from 'react';
import { Plant, PlantType } from '../types';
import { Search, Filter } from 'lucide-react';

interface FilterPanelProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  isOpen: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ plants, onSelectPlant, isOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || plant.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div 
      className={`fixed top-[5rem] left-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 transform z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Filter size={16} className="mr-2 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">Filter by Type</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                selectedType === 'all' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {Object.values(PlantType).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  selectedType === type 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Plants ({filteredPlants.length})</h3>
          
          {filteredPlants.length > 0 ? (
            <div className="space-y-2">
              {filteredPlants.map(plant => (
                <div 
                  key={plant.id} 
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectPlant(plant)}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    {plant.imageUrl && (
                      <img 
                        src={plant.imageUrl} 
                        alt={plant.name} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{plant.name}</p>
                    <p className="text-xs text-gray-500">{plant.scientificName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No plants found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;