const Datastore = require('nedb');
const path = require('path');

// Path to your NeDB database file
const dbPath = path.join(__dirname, '../guestbook.db');

// Initialize NeDB datastore
const db = new Datastore({ filename: dbPath, autoload: true });

// Function to update the fields
function updateFields() {
  // Step 1: Find all documents where 'subject' exists
  db.find({ subject: { $exists: true } }, (err, docs) => {
    if (err) {
      console.error('Error finding documents:', err);
      return;
    }
    
    // Step 2: Update each document
    docs.forEach(doc => {
      const newDoc = { ...doc }; // Create a copy of the document
      if (newDoc.subject) {
        newDoc.itemName = newDoc.subject; // Rename 'subject' to 'itemName'
        delete newDoc.subject; // Remove 'subject' from the document
      }

      // Step 3: Save the updated document
      db.update({ _id: doc._id }, newDoc, {}, (err, numReplaced) => {
        if (err) {
          console.error('Error updating document:', err);
        } else {
          console.log(`Document ${doc._id} updated: ${numReplaced}`);
        }
      });
    });
  });
}

// Execute the update function
updateFields();
