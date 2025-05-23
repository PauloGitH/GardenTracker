import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GardenMap from './components/GardenMap';
import PlantDetail from './components/PlantDetail';
import PlantForm from './components/PlantForm';
import { useGardenData } from './hooks/useGardenData';
import { Plant, Position } from './types';

function App() {
  const {
    gardenData,
    selectedPlant,
    setSelectedPlant,
    isLoading,
    addPlant,
    updatePlant,
    deletePlant,
    updatePlantPosition,
    getStatistics
  } = useGardenData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlantPosition, setNewPlantPosition] = useState<Position | undefined>(undefined);
  const [showEditGardenName, setShowEditGardenName] = useState(false);
  const [editedGardenName, setEditedGardenName] = useState(gardenData.gardenName);

  const handleAddPlant = () => {
    setShowAddForm(true);
    setNewPlantPosition(undefined);
  };

  const handleAddPlantAtPosition = (position: Position) => {
    setShowAddForm(true);
    setNewPlantPosition(position);
  };

  const handleSavePlant = (plant: Omit<Plant, 'id'>) => {
    addPlant(plant);
    setShowAddForm(false);
    setNewPlantPosition(undefined);
  };

  const handleCancelAddPlant = () => {
    setShowAddForm(false);
    setNewPlantPosition(undefined);
  };

  const handleEditGardenName = () => {
    setShowEditGardenName(true);
  };

  const handleSaveGardenName = () => {
    // In a real app, we would update the garden name in the database
    console.log('Garden name updated to:', editedGardenName);
    setShowEditGardenName(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-emerald-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-emerald-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-emerald-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Edit Garden Name Modal */}
      {showEditGardenName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Garden Name</h2>
            <input
              type="text"
              value={editedGardenName}
              onChange={(e) => setEditedGardenName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditGardenName(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGardenName}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Plant Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <PlantForm
              onSave={handleSavePlant}
              onCancel={handleCancelAddPlant}
              initialPosition={newPlantPosition}
            />
          </div>
        </div>
      )}

      <Header
        gardenName={gardenData.gardenName}
        onEditGardenName={handleEditGardenName}
      />

      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 container mx-auto">
        <div className="w-full md:w-80 flex-shrink-0">
          <Sidebar
            plants={gardenData.plants}
            onAddPlant={handleAddPlant}
            onSelectPlant={setSelectedPlant}
            selectedPlant={selectedPlant}
            statistics={getStatistics()}
          />
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className={`flex-1 ${selectedPlant ? 'hidden md:block' : 'block'}`}>
            <GardenMap
              plants={gardenData.plants}
              dimensions={gardenData.dimensions}
              selectedPlant={selectedPlant}
              onSelectPlant={setSelectedPlant}
              onUpdatePlantPosition={updatePlantPosition}
              onAddPlantAtPosition={handleAddPlantAtPosition}
            />
          </div>

          {selectedPlant && (
            <div className="w-full md:w-96 flex-shrink-0 md:block">
              <PlantDetail
                plant={selectedPlant}
                onClose={() => setSelectedPlant(null)}
                onUpdate={updatePlant}
                onDelete={deletePlant}
              />
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto py-3 px-4 text-center text-sm text-gray-500">
          <p>Garden Tracker &copy; 2025 | Last updated: {new Date(gardenData.lastUpdated).toLocaleString()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;