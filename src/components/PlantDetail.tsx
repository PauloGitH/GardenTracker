import React, { useState } from 'react';
import { 
  X, Edit, Trash2, Calendar, Droplet, Sprout, 
  AlertCircle, FileText, ArrowLeft, Check, 
  Flower, Sun, Cloud, Leaf
} from 'lucide-react';
import { Plant, PlantType, Season, HealthStatus } from '../types';

interface PlantDetailProps {
  plant: Plant;
  onClose: () => void;
  onUpdate: (plant: Plant) => void;
  onDelete: (plantId: string) => void;
}

const PlantDetail: React.FC<PlantDetailProps> = ({
  plant,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState<Plant>(plant);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPlant(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSeasonChange = (season: Season) => {
    const newSeasons = editedPlant.seasonality.includes(season)
      ? editedPlant.seasonality.filter(s => s !== season)
      : [...editedPlant.seasonality, season];
    
    setEditedPlant(prev => ({
      ...prev,
      seasonality: newSeasons
    }));
  };
  
  const handleSave = () => {
    onUpdate(editedPlant);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPlant(plant);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      onDelete(plant.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const needsWater = () => {
    if (!plant.lastWatered) return true;
    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWatered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3;
  };
  
  const needsFertilizer = () => {
    if (!plant.lastFertilized) return true;
    const lastFertilized = new Date(plant.lastFertilized);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastFertilized.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 14;
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full w-full">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          {isEditing ? (
            <h2 className="text-lg font-semibold">Edit Plant</h2>
          ) : (
            <>
              <ArrowLeft className="h-5 w-5 mr-2 cursor-pointer" onClick={onClose} />
              <h2 className="text-lg font-semibold">{plant.name}</h2>
            </>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="p-1.5 rounded-full bg-white text-emerald-600 hover:bg-emerald-50"
              >
                <Check className="h-5 w-5" />
              </button>
              <button 
                onClick={handleCancel}
                className="p-1.5 rounded-full bg-white text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-full bg-white text-gray-600 hover:bg-gray-100"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 rounded-full bg-white text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full bg-white text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plant Name
              </label>
              <input
                type="text"
                name="name"
                value={editedPlant.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Species
              </label>
              <input
                type="text"
                name="species"
                value={editedPlant.species}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plant Type
              </label>
              <select
                name="type"
                value={editedPlant.type}
                onChange={handleInputChange}
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
                Health Status
              </label>
              <select
                name="healthStatus"
                value={editedPlant.healthStatus}
                onChange={handleInputChange}
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
                Date Planted
              </label>
              <input
                type="date"
                name="plantedDate"
                value={editedPlant.plantedDate}
                onChange={handleInputChange}
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
                value={editedPlant.lastWatered || ''}
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
                value={editedPlant.lastFertilized || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seasonality
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(Season).map(season => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => handleSeasonChange(season as Season)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      editedPlant.seasonality.includes(season as Season)
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
                    {season === Season.Spring && <Sun className="inline h-3 w-3 mr-1" />}
                    {season === Season.Summer && <Sun className="inline h-3 w-3 mr-1" />}
                    {season === Season.Fall && <Leaf className="inline h-3 w-3 mr-1" />}
                    {season === Season.Winter && <Cloud className="inline h-3 w-3 mr-1" />}
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={editedPlant.image || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={editedPlant.notes || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {plant.image ? (
                <div className="w-full md:w-1/3 rounded-lg overflow-hidden h-48 flex-shrink-0">
                  <img 
                    src={plant.image} 
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-1/3 rounded-lg bg-gray-200 h-48 flex items-center justify-center flex-shrink-0">
                  <Flower className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Species</h3>
                  <p className="text-base italic">{plant.species}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
                  </span>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    plant.healthStatus === HealthStatus.Excellent
                      ? 'bg-green-100 text-green-800'
                      : plant.healthStatus === HealthStatus.Good
                      ? 'bg-green-100 text-green-800'
                      : plant.healthStatus === HealthStatus.Fair
                      ? 'bg-yellow-100 text-yellow-800'
                      : plant.healthStatus === HealthStatus.Poor
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {plant.healthStatus.charAt(0).toUpperCase() + plant.healthStatus.slice(1)}
                  </span>
                  
                  {plant.seasonality.map(season => (
                    <span 
                      key={season}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        season === Season.Spring
                          ? 'bg-green-100 text-green-800'
                          : season === Season.Summer
                          ? 'bg-yellow-100 text-yellow-800'
                          : season === Season.Fall
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {season === Season.Spring && <Sun className="h-3 w-3 mr-1" />}
                      {season === Season.Summer && <Sun className="h-3 w-3 mr-1" />}
                      {season === Season.Fall && <Leaf className="h-3 w-3 mr-1" />}
                      {season === Season.Winter && <Cloud className="h-3 w-3 mr-1" />}
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Planted</p>
                      <p className="text-sm">{formatDate(plant.plantedDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Droplet className={`h-5 w-5 ${needsWater() ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-xs text-gray-500">Last Watered</p>
                      <p className="text-sm">
                        {plant.lastWatered ? formatDate(plant.lastWatered) : 'Not recorded'}
                        {needsWater() && <span className="text-blue-500 ml-1">Needs water!</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Sprout className={`h-5 w-5 ${needsFertilizer() ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-xs text-gray-500">Last Fertilized</p>
                      <p className="text-sm">
                        {plant.lastFertilized ? formatDate(plant.lastFertilized) : 'Not recorded'}
                        {needsFertilizer() && <span className="text-green-500 ml-1">Needs fertilizer!</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <FileText className="h-4 w-4 mr-1" />
                Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                {plant.notes || 'No notes recorded for this plant.'}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                Care Tips
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  {plant.type === PlantType.Tree && (
                    <>
                      <li>Water deeply but infrequently to encourage deep root growth</li>
                      <li>Mulch around the base, keeping mulch away from the trunk</li>
                      <li>Prune during dormant season to maintain shape and health</li>
                    </>
                  )}
                  {plant.type === PlantType.Flower && (
                    <>
                      <li>Deadhead spent blooms to encourage more flowers</li>
                      <li>Water at the base to keep foliage dry and prevent disease</li>
                      <li>Apply flower-specific fertilizer during growing season</li>
                    </>
                  )}
                  {plant.type === PlantType.Vegetable && (
                    <>
                      <li>Ensure consistent watering for even growth</li>
                      <li>Regularly check for pests on the undersides of leaves</li>
                      <li>Harvest regularly to encourage continued production</li>
                    </>
                  )}
                  {plant.type === PlantType.Herb && (
                    <>
                      <li>Harvest regularly to promote bushy growth</li>
                      <li>Most herbs prefer well-draining soil and moderate watering</li>
                      <li>Many herbs can be divided every few years to rejuvenate</li>
                    </>
                  )}
                  {plant.type === PlantType.Fruit && (
                    <>
                      <li>Thin fruit early in the season for larger, healthier produce</li>
                      <li>Protect from birds with netting when fruit begins to ripen</li>
                      <li>Prune to improve air circulation and reduce disease</li>
                    </>
                  )}
                  {plant.type === PlantType.Shrub && (
                    <>
                      <li>Prune after flowering to maintain shape</li>
                      <li>Apply mulch to conserve moisture and suppress weeds</li>
                      <li>Water deeply rather than frequently to encourage deep roots</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      {!isEditing && (
        <div className="p-4 border-t">
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => {
                onUpdate({
                  ...plant,
                  lastWatered: new Date().toISOString().split('T')[0]
                });
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <Droplet className="h-4 w-4 mr-1" />
              Water Now
            </button>
            
            <button
              onClick={() => {
                onUpdate({
                  ...plant,
                  lastFertilized: new Date().toISOString().split('T')[0]
                });
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            >
              <Sprout className="h-4 w-4 mr-1" />
              Fertilize
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetail;