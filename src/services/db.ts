import sqlite3 from 'sqlite3';
import { Plant } from '../types';

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
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
}

export const getAllPlants = (): Promise<Plant[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM plants', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      const plants: Plant[] = rows.map(row => ({
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
        seasonalInfo: JSON.parse(row.seasonalInfo || '{}'),
        notes: row.notes
      }));
      
      resolve(plants);
    });
  });
};

export const addPlant = (plant: Plant): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { position, seasonalInfo, ...rest } = plant;
    
    db.run(
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
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const updatePlant = (plant: Plant): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { position, seasonalInfo, ...rest } = plant;
    
    db.run(
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
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const deletePlant = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM plants WHERE id = ?', [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Initialize with sample data
import plantsData from '../data/plants.json';
plantsData.plants.forEach(plant => {
  addPlant(plant).catch(console.error);
});