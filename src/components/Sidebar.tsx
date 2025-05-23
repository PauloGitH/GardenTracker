import React, { useState } from 'react';
import { Plus, Search, Filter, BarChart2, Settings, Trees as Tree, Flower, Leaf, Droplet, Sun, Tag } from 'lucide-react';
import { Plant, PlantType, Season, HealthStatus } from '../types';

interface SidebarProps {
  plants: Plant[];
  onAddPlant: () => void;
  onSelectPlant: (plant: Plant) => void;
  selectedPlant: Plant | null;
  statistics: {
    totalPlants: number;
    plantTypes: Record<string, number>;
    healthStatuses: Record<string, number>;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  plants, 
  onAddPlant, 
  onSelectPlant, 
  selectedPlant,
  statistics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<PlantType | ''>('');
  const [showStats, setShowStats] = useState(false);

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         plant.species.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? plant.type === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const getPlantTypeIcon = (type: PlantType) => {
    switch (type) {
      case PlantType.Tree:
        return <Tree className="h-4 w-4 text-emerald-700" />;
      case PlantType.Flower:
        return <Flower className="h-4 w-4 text-pink-500" />;
      case PlantType.Herb:
        return <Leaf className="h-4 w-4 text-green-500" />;
      case PlantType.Vegetable:
        return <Leaf className="h-4 w-4 text-green-600" />;
      case PlantType.Fruit:
        return <Leaf className="h-4 w-4 text-red-500" />;
      case PlantType.Shrub:
        return <Leaf className="h-4 w-4 text-emerald-600" />;
      default:
        return <Leaf className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.Excellent:
        return 'bg-green-500';
      case HealthStatus.Good:
        return 'bg-green-400';
      case HealthStatus.Fair:
        return 'bg-yellow-400';
      case HealthStatus.Poor:
        return 'bg-orange-400';
      case HealthStatus.Critical:
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const needsWater = (plant: Plant) => {
    if (!plant.lastWatered) return false;
    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWatered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full md:w-80 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Plants</h2>
          <button 
            onClick={onAddPlant}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search plants..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterType === '' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200 whitespace-nowrap`}
          >
            All
          </button>
          {Object.values(PlantType).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as PlantType)}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                filterType === type ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200 whitespace-nowrap`}
            >
              {getPlantTypeIcon(type as PlantType)}
              <span className="ml-1 capitalize">{type}</span>
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            {showStats ? 'Hide Statistics' : 'Show Statistics'}
            <BarChart2 className="h-4 w-4 ml-1" />
          </button>
          
          <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </button>
        </div>
      </div>
      
      {showStats && (
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Garden Statistics</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-xs text-gray-500">Total Plants</div>
              <div className="text-lg font-semibold">{statistics.totalPlants}</div>
            </div>
            
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-xs text-gray-500">Plant Types</div>
              <div className="text-lg font-semibold">{Object.keys(statistics.plantTypes).length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">Plant Types Distribution</h4>
            {Object.entries(statistics.plantTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getPlantTypeIcon(type as PlantType)}
                  <span className="text-xs text-gray-700 ml-1 capitalize">{type}</span>
                </div>
                <span className="text-xs font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredPlants.length > 0 ? (
          filteredPlants.map(plant => (
            <div 
              key={plant.id}
              onClick={() => onSelectPlant(plant)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                selectedPlant?.id === plant.id 
                  ? 'bg-emerald-50 border-2 border-emerald-500' 
                  : 'bg-white border border-gray-200 hover:border-emerald-300 hover:shadow'
              }`}
            >
              <div className="flex items-start space-x-3">
                {plant.image ? (
                  <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden">
                    <img 
                      src={plant.image} 
                      alt={plant.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center">
                    {getPlantTypeIcon(plant.type as PlantType)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-800 truncate">{plant.name}</h3>
                    <div className={`h-2 w-2 rounded-full ${getHealthStatusColor(plant.healthStatus)}`}></div>
                  </div>
                  
                  <p className="text-xs text-gray-500 italic mb-1 truncate">{plant.species}</p>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 ml-1 capitalize">{plant.type}</span>
                    </div>
                    
                    {needsWater(plant) && (
                      <div className="flex items-center text-blue-500">
                        <Droplet className="h-3 w-3" />
                        <span className="text-xs ml-1">Needs water</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex mt-1 space-x-1">
                    {plant.seasonality.map(season => (
                      <span 
                        key={season}
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          season === Season.Spring ? 'bg-green-100 text-green-800' :
                          season === Season.Summer ? 'bg-yellow-100 text-yellow-800' :
                          season === Season.Fall ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {season === Season.Spring && <Sun className="inline h-2 w-2 mr-0.5" />}
                        {season === Season.Summer && <Sun className="inline h-2 w-2 mr-0.5" />}
                        {season === Season.Fall && <Leaf className="inline h-2 w-2 mr-0.5" />}
                        {season === Season.Winter && <Cloud className="inline h-2 w-2 mr-0.5" />}
                        {season.charAt(0).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Search className="h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm">No plants found</p>
            <button 
              onClick={onAddPlant}
              className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              Add your first plant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;