import { Plant } from '../types';
import plantsData from '../data/plants.json';

// Get all plants
export const getAllPlants = (): Plant[] => {
  // In a real app, we'd fetch from localStorage first, then fall back to initial data
  const storedPlants = localStorage.getItem('gardenPlants');
  if (storedPlants) {
    return JSON.parse(storedPlants);
  }
  return plantsData.plants;
};

// Save plants to localStorage
const savePlants = (plants: Plant[]): void => {
  localStorage.setItem('gardenPlants', JSON.stringify(plants));
};

// Add new plant
export const addPlant = (plant: Plant): Plant[] => {
  const currentPlants = getAllPlants();
  const updatedPlants = [...currentPlants, plant];
  savePlants(updatedPlants);
  return updatedPlants;
};

// Update existing plant
export const updatePlant = (updatedPlant: Plant): Plant[] => {
  const currentPlants = getAllPlants();
  const updatedPlants = currentPlants.map(plant => 
    plant.id === updatedPlant.id ? updatedPlant : plant
  );
  savePlants(updatedPlants);
  return updatedPlants;
};

// Delete plant
export const deletePlant = (id: string): Plant[] => {
  const currentPlants = getAllPlants();
  const updatedPlants = currentPlants.filter(plant => plant.id !== id);
  savePlants(updatedPlants);
  return updatedPlants;
};
