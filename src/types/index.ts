export interface Plant {
  id: string;
  name: string;
  species: string;
  type: PlantType;
  position: Position;
  plantedDate: string;
  lastWatered?: string;
  lastFertilized?: string;
  notes?: string;
  healthStatus: HealthStatus;
  seasonality: Season[];
  image?: string;
}

export interface Position {
  x: number;
  y: number;
}

export enum PlantType {
  Tree = 'tree',
  Shrub = 'shrub',
  Flower = 'flower',
  Vegetable = 'vegetable',
  Herb = 'herb',
  Fruit = 'fruit',
  Other = 'other'
}

export enum HealthStatus {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  Critical = 'critical'
}

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter'
}

export interface GardenData {
  plants: Plant[];
  gardenName: string;
  dimensions: {
    width: number;
    height: number;
  };
  lastUpdated: string;
}