import { Plant } from '../types';
import { getAllPlants as dbGetAllPlants, addPlant as dbAddPlant, updatePlant as dbUpdatePlant, deletePlant as dbDeletePlant } from './db';

export const getAllPlants = async (): Promise<Plant[]> => {
  return await dbGetAllPlants();
};

export const addPlant = async (plant: Plant): Promise<Plant[]> => {
  await dbAddPlant(plant);
  return await dbGetAllPlants();
};

export const updatePlant = async (plant: Plant): Promise<Plant[]> => {
  await dbUpdatePlant(plant);
  return await dbGetAllPlants();
};

export const deletePlant = async (id: string): Promise<Plant[]> => {
  await dbDeletePlant(id);
  return await dbGetAllPlants();
};