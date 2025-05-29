import { Plant } from '../types';
import { getAllPlants as dbGetAllPlants, addPlant as dbAddPlant, updatePlant as dbUpdatePlant, deletePlant as dbDeletePlant } from './db';

export const getAllPlants = async (): Promise<Plant[]> => {
  return await dbGetAllPlants();
};

export const addPlant = async (plant: Plant): Promise<Plant[]> => {
  return await dbAddPlant(plant);
};

export const updatePlant = async (plant: Plant): Promise<Plant[]> => {
  return await dbUpdatePlant(plant);
};

export const deletePlant = async (id: string): Promise<Plant[]> => {
  return await dbDeletePlant(id);
};
