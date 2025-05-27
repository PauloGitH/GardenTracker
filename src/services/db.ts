import { createClient } from '@libsql/client';
import { Plant } from '../types';

const client = createClient({
  url: 'file:garden.db',
});

async function initializeDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      scientificName TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      plantedDate TEXT NOT NULL,
      wateringFrequency INTEGER NOT NULL,
      sunlight TEXT NOT NULL,
      soilType TEXT NOT NULL,
      height INTEGER NOT NULL,
      spread INTEGER NOT NULL,
      notes TEXT,
      seasonalInfo TEXT
    )
  `);

  // Check if the table is empty before initializing with sample data
  const result = await client.execute('SELECT COUNT(*) as count FROM plants');
  const count = result.rows[0].count;

  if (count === 0) {
    // Initialize with sample data only if the table is empty
    const plantsData = await import('../data/plants.json');
    for (const plant of plantsData.plants) {
      await addPlant(plant);
    }
  }
}

export const getAllPlants = async (): Promise<Plant[]> => {
  const result = await client.execute('SELECT * FROM plants');
  
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    scientificName: row.scientificName as string,
    type: row.type as string,
    description: row.description as string,
    imageUrl: row.imageUrl as string,
    position: {
      lat: row.latitude as number,
      lng: row.longitude as number
    },
    plantedDate: row.plantedDate as string,
    wateringFrequency: row.wateringFrequency as number,
    sunlight: row.sunlight as string,
    soilType: row.soilType as string,
    height: row.height as number,
    spread: row.spread as number,
    seasonalInfo: JSON.parse(row.seasonalInfo as string || '{}'),
    notes: row.notes as string
  }));
};

export const addPlant = async (plant: Plant): Promise<void> => {
  const { position, seasonalInfo, ...rest } = plant;
  
  await client.execute({
    sql: `INSERT INTO plants (
      id, name, scientificName, type, description, imageUrl,
      latitude, longitude, plantedDate, wateringFrequency,
      sunlight, soilType, height, spread, notes, seasonalInfo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      plant.id,
      rest.name,
      rest.scientificName,
      rest.type,
      rest.description,
      rest.imageUrl,
      position.lat,
      position.lng,
      rest.plantedDate,
      rest.wateringFrequency,
      rest.sunlight,
      rest.soilType,
      rest.height,
      rest.spread,
      rest.notes,
      JSON.stringify(seasonalInfo)
    ]
  });
};

export const updatePlant = async (plant: Plant): Promise<void> => {
  const { position, seasonalInfo, ...rest } = plant;
  
  await client.execute({
    sql: `UPDATE plants SET
      name = ?, scientificName = ?, type = ?, description = ?,
      imageUrl = ?, latitude = ?, longitude = ?, plantedDate = ?,
      wateringFrequency = ?, sunlight = ?, soilType = ?,
      height = ?, spread = ?, notes = ?, seasonalInfo = ?
    WHERE id = ?`,
    args: [
      rest.name,
      rest.scientificName,
      rest.type,
      rest.description,
      rest.imageUrl,
      position.lat,
      position.lng,
      rest.plantedDate,
      rest.wateringFrequency,
      rest.sunlight,
      rest.soilType,
      rest.height,
      rest.spread,
      rest.notes,
      JSON.stringify(seasonalInfo),
      plant.id
    ]
  });
};

export const deletePlant = async (id: string): Promise<void> => {
  await client.execute({
    sql: 'DELETE FROM plants WHERE id = ?',
    args: [id]
  });
};

// Initialize the database
initializeDatabase().catch(console.error);

export default client;