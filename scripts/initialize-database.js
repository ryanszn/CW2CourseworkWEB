const nedb = require('nedb');
const path = require('path');
const fs = require('fs');

// Define the path to your database and initial data
const dbPath = path.join(__dirname, '../guestbook.db');
const initialDataPath = path.join(__dirname, '../data/initialData.json');

// Create or open the database
const db = new nedb({ filename: dbPath, autoload: true });

// Read initial data from the JSON file
fs.readFile(initialDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading initial data:', err);
    return;
  }

  try {
    const entries = JSON.parse(data);
    console.log('Entries to insert:', entries); // Log entries to be inserted

    // Insert data into the database
    db.insert(entries, (err, newDocs) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log('Database initialized with initial data.');
        console.log('Inserted documents:', newDocs); // Log inserted documents
      }
    });
  } catch (parseError) {
    console.error('Error parsing initial data:', parseError);
  }
});
