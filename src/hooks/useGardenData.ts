import { useState, useEffect } from 'react';
import { GardenData, Plant, Position } from '../types';
import initialData from '../data/gardenData.json';

export function useGardenData() {
  const [gardenData, setGardenData] = useState<GardenData>(initialData as GardenData);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    // In a real app, you would load from localStorage or an API
    // For now, we're using the imported JSON data
    setIsLoading(false);
  }, []);

  // Save data
  const saveGardenData = (data: GardenData) => {
    // In a real app, you would save to localStorage or an API
    setGardenData({
      ...data,
      lastUpdated: new Date().toISOString()
    });
    // For demo purposes, log the data that would be saved
    console.log('Saving garden data:', data);
  };

  // Add a new plant
  const addPlant = (plant: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...plant,
      id: `plant-${Date.now()}`
    };
    
    const updatedData = {
      ...gardenData,
      plants: [...gardenData.plants, newPlant]
    };
    
    saveGardenData(updatedData);
    return newPlant;
  };

  // Update an existing plant
  const updatePlant = (updatedPlant: Plant) => {
    const updatedPlants = gardenData.plants.map(plant => 
      plant.id === updatedPlant.id ? updatedPlant : plant
    );
    
    const updatedData = {
      ...gardenData,
      plants: updatedPlants
    };
    
    saveGardenData(updatedData);
  };

  // Delete a plant
  const deletePlant = (plantId: string) => {
    const updatedPlants = gardenData.plants.filter(plant => plant.id !== plantId);
    
    const updatedData = {
      ...gardenData,
      plants: updatedPlants
    };
    
    saveGardenData(updatedData);
    
    if (selectedPlant?.id === plantId) {
      setSelectedPlant(null);
    }
  };

  // Update plant position
  const updatePlantPosition = (plantId: string, position: Position) => {
    const updatedPlants = gardenData.plants.map(plant => 
      plant.id === plantId ? { ...plant, position } : plant
    );
    
    const updatedData = {
      ...gardenData,
      plants: updatedPlants
    };
    
    saveGardenData(updatedData);
  };

  // Get statistics
  const getStatistics = () => {
    const plantTypes = gardenData.plants.reduce((acc, plant) => {
      acc[plant.type] = (acc[plant.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const healthStatuses = gardenData.plants.reduce((acc, plant) => {
      acc[plant.healthStatus] = (acc[plant.healthStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPlants: gardenData.plants.length,
      plantTypes,
      healthStatuses
    };
  };

  return {
    gardenData,
    selectedPlant,
    setSelectedPlant,
    isLoading,
    addPlant,
    updatePlant,
    deletePlant,
    updatePlantPosition,
    getStatistics
  };
}