import { Pool } from 'mysql2/promise';
import { Plant } from '../types';

const pool = new Pool({
  host: 'db',
  user: 'garden_user',
  password: 'garden_password',
  database: 'garden',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  //socketPath: '/tmp/mysql.sock' //ajout pour évier les erreurs
});

async function initializeDatabase() {
  const connection = await pool.getConnection();
  
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS plants (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        scientificName VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        imageUrl TEXT,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        plantedDate DATE NOT NULL,
        wateringFrequency INT NOT NULL,
        sunlight VARCHAR(50) NOT NULL,
        soilType VARCHAR(50) NOT NULL,
        height INT NOT NULL,
        spread INT NOT NULL,
        notes TEXT,
        seasonalInfo JSON
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM plants');
    const count = (rows as any[])[0].count;

    if (count === 0) {
      const plantsData = await import('../data/plants.json');
      for (const plant of plantsData.plants) {
        await addPlant(plant);
      }
    }
  } finally {
    connection.release();
  }
}

export const getAllPlants = async (): Promise<Plant[]> => {
  const [rows] = await pool.query('SELECT * FROM plants');
  
  return (rows as any[]).map(row => ({
    id: row.id,
    name: row.name,
    scientificName: row.scientificName,
    type: row.type,
    description: row.description,
    imageUrl: row.imageUrl,
    position: {
      lat: row.latitude,
      lng: row.longitude
    },
    plantedDate: row.plantedDate,
    wateringFrequency: row.wateringFrequency,
    sunlight: row.sunlight,
    soilType: row.soilType,
    height: row.height,
    spread: row.spread,
    seasonalInfo: row.seasonalInfo || {},
    notes: row.notes
  }));
};

export const addPlant = async (plant: Plant): Promise<Plant[]> => {
  const { position, seasonalInfo, ...rest } = plant;
  
  await pool.query(
    `INSERT INTO plants (
      id, name, scientificName, type, description, imageUrl,
      latitude, longitude, plantedDate, wateringFrequency,
      sunlight, soilType, height, spread, notes, seasonalInfo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
  );
  
  return getAllPlants();
};

export const updatePlant = async (plant: Plant): Promise<Plant[]> => {
  const { position, seasonalInfo, ...rest } = plant;
  
  await pool.query(
    `UPDATE plants SET
      name = ?, scientificName = ?, type = ?, description = ?,
      imageUrl = ?, latitude = ?, longitude = ?, plantedDate = ?,
      wateringFrequency = ?, sunlight = ?, soilType = ?,
      height = ?, spread = ?, notes = ?, seasonalInfo = ?
    WHERE id = ?`,
    [
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
  );
  
  return getAllPlants();
};

export const deletePlant = async (id: string): Promise<Plant[]> => {
  await pool.query('DELETE FROM plants WHERE id = ?', [id]);
  return getAllPlants();
};

// Initialize the database
initializeDatabase().catch(console.error);
