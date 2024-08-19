// Import the NeDB module for database management and bcrypt for password hashing.
const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Define the number of salt rounds for bcrypt hashing.

// Define the UserDAO (Data Access Object) class to manage user-related database operations.
class UserDAO {
  
  // Constructor to initialize the database, either with a file or in memory.
  constructor(dbFilePath) {
    if (dbFilePath) {
      // If a database file path is provided, create a persistent database with auto-loading.
      this.db = new Datastore({
        filename: dbFilePath.filename,
        autoload: true,
      });
    } else {
      // If no file path is provided, create an in-memory database.
      this.db = new Datastore();
    }
  }
  
  // Method to initialize the database with some initial users.
  init() {
    // Define an array of initial users with pre-hashed passwords and roles.
    const users = [
      {
        user: 'Peter',
        password: '$2b$10$5.YNO1fwGfMkobDMONxQ5ujPw7j2uOzJDOVaKxHT3clz1oVE3ty3i', // Pre-hashed password
        role: 'normalUser' // User role
      },
      {
        user: 'Ann',
        password: '$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S', // Pre-hashed password
        role: 'admin' // Admin role
      }
    ];

    // Insert the initial users into the database.
    this.db.insert(users, function(err, newDocs) {
      if(err) {
        console.error("Error initializing database:", err); // Log any error during initialization.
      } else {
        console.log("Database initialized with users:", newDocs); // Log the successfully inserted users.
      }
    });
  }

  // Method to create a new user with a hashed password and a specified role.
  create(username, password, role) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds)
        .then(hash => {
          const entry = {
            user: username,
            password: hash,
            role: role,
          };
          this.db.insert(entry, function (err, newDoc) {
            if (err) {
              console.error("Can't insert user:", username, err); // Log an error if the insertion fails.
              reject(err); // Reject the promise if insertion fails
            } else {
              resolve(newDoc); // Resolve the promise with the new document
            }
          });
        })
        .catch(err => {
          console.error("Error hashing password:", err); // Handle any errors during password hashing.
          reject(err); // Reject the promise if hashing fails
        });
    });
  }

  // Method to look up a user by their username.
  lookup(user, cb) {
    this.db.find({ user: user }, function (err, entries) {
      if (err) {
        return cb(err, null); // If an error occurs, pass it to the callback.
      }
      if (entries.length === 0) {
        return cb(null, null); // If no user is found, return null.
      }
      return cb(null, entries[0]); // Return the found user.
    });
  }

  // Method to retrieve all users from the database.
  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, users) {
        if (err) {
          reject(err); // Reject the promise if an error occurs.
        } else {
          resolve(users); // Resolve the promise with the retrieved users.
        }
      });
    });
  }

  // Method to delete a user by their ID.
  deleteUser(userId, callback) {
    this.db.remove({ _id: userId }, {}, function (err, numRemoved) {
      if (err) {
        callback(err); // If an error occurs, pass it to the callback.
      } else {
        callback(null); // Otherwise, indicate success with a null error.
      }
    });
  }
}

// Create an instance of UserDAO with a specified database file and initialize it.
const dao = new UserDAO({ filename: "users.db", autoload: true });
dao.init(); // Initialize the database with initial users.

// Export the DAO instance for use in other parts of the application.
module.exports = dao;
