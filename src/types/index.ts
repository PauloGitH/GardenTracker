export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  type: PlantType;
  description: string;
  imageUrl: string;
  position: {
    lat: number;
    lng: number;
  };
  plantedDate: string;
  wateringFrequency: number; // in days
  sunlight: SunlightRequirement;
  soilType: SoilType;
  height: number; // in cm
  spread: number; // in cm
  seasonalInfo: {
    bloomingSeason?: Season[];
    harvestSeason?: Season[];
    dormantSeason?: Season[];
  };
  notes: string;
}

export enum PlantType {
  Tree = 'tree',
  Shrub = 'shrub',
  Flower = 'flower',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Herb = 'herb',
  Grass = 'grass',
  Other = 'other',
}

export enum SunlightRequirement {
  FullSun = 'full-sun',
  PartialShade = 'partial-shade',
  FullShade = 'full-shade',
}

export enum SoilType {
  Clay = 'clay',
  Sandy = 'sandy',
  Loamy = 'loamy',
  Peaty = 'peaty',
  Chalky = 'chalky',
  Silty = 'silty',
}

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter',
}
