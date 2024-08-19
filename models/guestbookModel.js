// Import the NeDB module, a lightweight JavaScript database.
const nedb = require('nedb');

// Define the GuestBook class to manage guestbook entries.
class GuestBook {
  constructor(dbFilePath) {
    // Initialize the database with a file path if provided, otherwise use an in-memory database.
    this.db = dbFilePath 
      ? new nedb({ filename: dbFilePath, autoload: true }) 
      : new nedb();
  }

  /**
   * Retrieve all guestbook entries from the database.
   * @returns {Promise<Array>} A promise that resolves with the list of entries.
   */
  getAllEntries() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, entries) => {
        if (err) {
          console.error("Error fetching all entries:", err); // Log the error.
          reject(err); // Reject the promise if an error occurs.
        } else {
          resolve(entries); // Resolve the promise with the retrieved entries.
        }
      });
    });
  }

  /**
   * Retrieve all entries authored by a specific author.
   * @param {string} authorName - The name of the author.
   * @returns {Promise<Array>} A promise that resolves with the entries authored by the specified author.
   */
  getEntriesByAuthor(authorName) {
    return new Promise((resolve, reject) => {
      this.db.find({ author: authorName }, (err, entries) => {
        if (err) {
          console.error("Error fetching entries by author:", err); // Log the error.
          reject(err); // Reject the promise if an error occurs.
        } else {
          resolve(entries); // Resolve the promise with the retrieved entries.
        }
      });
    });
  }

  /**
   * Add a new entry to the database.
   * @param {string} author - The author of the entry.
   * @param {string} itemName - The name of the item.
   * @param {string} contents - The contents of the entry.
   * @param {number} price - The price associated with the entry.
   * @returns {Promise<Object>} A promise that resolves with the inserted document.
   */
  addEntry(author, itemName, contents, price) {
    const entry = {
      author: author,
      itemName: itemName, // Field name updated to match form field
      contents: contents,
      price: price, // Added to match form field
      published: new Date().toISOString().split('T')[0], // Format the date as YYYY-MM-DD.
    };

    return new Promise((resolve, reject) => {
      this.db.insert(entry, (err, doc) => {
        if (err) {
          console.error("Error adding entry:", err); // Log the error.
          reject(err); // Reject the promise if insertion fails.
        } else {
          resolve(doc); // Resolve the promise with the inserted document.
        }
      });
    });
  }

  /**
   * Delete a specific entry by its ID.
   * @param {string} entryId - The ID of the entry to delete.
   * @returns {Promise<number>} A promise that resolves with the number of removed entries.
   */
  deleteEntry(entryId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: entryId }, { multi: false }, (err, numRemoved) => {
        if (err) {
          console.error("Error deleting entry:", err); // Log the error.
          reject(err); // Reject the promise if an error occurs.
        } else {
          resolve(numRemoved); // Resolve the promise with the number of deleted entries.
        }
      });
    });
  }
}

// Export the GuestBook class to be used in other parts of the application.
module.exports = GuestBook;
