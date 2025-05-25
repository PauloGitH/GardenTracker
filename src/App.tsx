import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Plant } from './types';
import { getAllPlants, addPlant, updatePlant, deletePlant } from './services/plantService';
import Header from './components/Header';
import GardenMap from './components/GardenMap';
import PlantDetail from './components/PlantDetail';
import PlantForm from './components/PlantForm';
import FilterPanel from './components/FilterPanel';

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [newPlantPosition, setNewPlantPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  useEffect(() => {
    const initialPlants = getAllPlants();
    setPlants(initialPlants);
  }, []);

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setNewPlantPosition(null);
    setEditingPlant(null);
  };

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setSelectedPlant(null);
    setNewPlantPosition(null);
  };

  const handleAddPlant = (position: { lat: number; lng: number }) => {
    setNewPlantPosition(position);
    setSelectedPlant(null);
    setEditingPlant(null);
  };

  const handleMovePlant = (id: string, newPosition: { lat: number; lng: number }) => {
    const plantToUpdate = plants.find(p => p.id === id);
    if (plantToUpdate) {
      const updatedPlant = { ...plantToUpdate, position: newPosition };
      const updatedPlants = updatePlant(updatedPlant);
      setPlants(updatedPlants);
      if (selectedPlant?.id === id) {
        setSelectedPlant(updatedPlant);
      }
    }
  };

  const handleSavePlant = (plant: Plant) => {
    if (editingPlant) {
      const updatedPlants = updatePlant(plant);
      setPlants(updatedPlants);
    } else {
      const updatedPlants = addPlant(plant);
      setPlants(updatedPlants);
    }
    setEditingPlant(null);
    setNewPlantPosition(null);
    setSelectedPlant(plant);
  };

  const handleDeletePlant = (id: string) => {
    const updatedPlants = deletePlant(id);
    setPlants(updatedPlants);
    setSelectedPlant(null);
  };

  const handleCancelForm = () => {
    setEditingPlant(null);
    setNewPlantPosition(null);
  };

  const handleCloseDetail = () => {
    setSelectedPlant(null);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (selectedPlant || editingPlant || newPlantPosition) {
      setSelectedPlant(null);
      setEditingPlant(null);
      setNewPlantPosition(null);
    }
  };

  const handleToggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  return (
    <div className="flex flex-col h-screen relative">
      <Header 
        editMode={editMode}
        onToggleEditMode={handleToggleEditMode}
        onToggleFilterPanel={handleToggleFilterPanel}
        filterPanelOpen={filterPanelOpen}
        className="relative z-20"
      />
      
      <main className="flex-grow relative">
        <GardenMap 
          plants={plants}
          onSelectPlant={handleSelectPlant}
          onAddPlant={handleAddPlant}
          onMovePlant={handleMovePlant}
          editMode={editMode}
        />
        
        <FilterPanel 
          plants={plants}
          onSelectPlant={handleSelectPlant}
          isOpen={filterPanelOpen}
        />
        
        {filterPanelOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-20"
            onClick={() => setFilterPanelOpen(false)}
          ></div>
        )}
        
        {selectedPlant && (
          <div className="absolute bottom-4 right-4 z-20 animate-fadeIn">
            <PlantDetail 
              plant={selectedPlant}
              onClose={handleCloseDetail}
              onEdit={handleEditPlant}
              onDelete={handleDeletePlant}
            />
          </div>
        )}
        
        {(editingPlant || newPlantPosition) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-30">
            <PlantForm
              plant={editingPlant}
              position={newPlantPosition || undefined}
              onSave={handleSavePlant}
              onCancel={handleCancelForm}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
