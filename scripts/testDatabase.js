const GuestBook = require('../models/guestbookModel'); // Adjust path if necessary

// Initialize the database
const db = new GuestBook('test.db'); // Use a separate test database file

// Function to run the test
async function runTest() {
  try {
    console.log('Starting database test...');

    // Add a test entry
    const addedEntry = await db.addEntry('TestAuthor', 'TestItem', 'TestContents', 10.00);
    console.log('Test entry added:', addedEntry);

    // Retrieve all entries
    const entries = await db.getAllEntries();
    console.log('Entries fetched:', entries);

    // Optionally, delete the test entry if needed
    // Assuming you want to delete the entry you just added
    if (addedEntry && addedEntry._id) {
      await db.deleteEntry(addedEntry._id);
      console.log('Test entry deleted.');
    }

    // Fetch remaining entries
    const remainingEntries = await db.getAllEntries();
    console.log('Remaining entries after deletion:', remainingEntries);

  } catch (err) {
    console.error('Error during database test:', err);
  }
}

// Run the test
runTest();
