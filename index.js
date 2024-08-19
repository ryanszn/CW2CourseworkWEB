// Import the express module and create an instance of the Express application
const express = require('express');
const app = express();

// Load environment variables from a .env file into process.env
require('dotenv').config(); // Loads data from .env file

// Import and use the cookie-parser middleware to handle cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Middleware to parse URL-encoded bodies (e.g., from form submissions)
app.use(express.urlencoded({ extended: true })); // Allows nested objects in query strings

// Middleware to parse JSON bodies (for API endpoints)
app.use(express.json()); // Parses JSON bodies, useful for APIs

// Import the path module to handle file and directory paths
const path = require('path');

// Define the path to the 'public' directory where static files are served from
const public = path.join(__dirname, 'public');
app.use(express.static(public)); // Serve static files from 'public' directory

// Serve Bootstrap CSS files from the node_modules directory
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));

// Import and configure Mustache as the templating engine for rendering views
const mustache = require('mustache-express');
app.engine('mustache', mustache()); // Register Mustache as the template engine
app.set('view engine', 'mustache'); // Set Mustache as the default view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Import and use custom routes defined in 'guestbookRoutes.js'
const router = require('./routes/guestbookRoutes');
app.use('/', router); // Use the routes defined in 'guestbookRoutes.js' for the root path

// Define a route for /newEntry to ensure the view is rendered correctly
app.get('/newEntry', (req, res) => {
  res.render('newEntry'); // Ensure 'newEntry.mustache' exists in the 'views' directory
});

// Define a route to handle POST requests to /newEntry
const GuestBook = require('./models/guestbookModel'); // Adjust the path as needed

app.post('/newEntry', (req, res) => {
  // Initialize the database
  const db = new GuestBook(path.join(__dirname, 'routes', 'guestbook.db'));

  try {
    // Extract form fields from req.body
    const { author, content } = req.body;

    // Log the received form data for debugging
    console.log('Form data received:', { author, content });

    // Validate that all required fields are provided
    if (!author || !content) {
      console.error('Validation failed: Missing fields. Received:', { author, content });
      return res.status(400).send('All fields must be filled.');
    }

    // Add the entry to the database
    db.addEntry(author, content)
      .then(() => {
        console.log('Entry added successfully.');
        res.redirect('/'); // Redirect to the main page or a success page
      })
      .catch((error) => {
        // Log detailed error information
        console.error('Error adding entry to the database:', {
          message: error.message,
          stack: error.stack,
        });
        res.status(500).send('Error adding entry to the database: ' + error.message);
      });

  } catch (error) {
    // Log detailed error information
    console.error('Error processing form data:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).send('Error processing form data: ' + error.message);
  }
});


// Define a simple route to test if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!'); // Simple test route
});

// Start the Express server on the port specified in the environment variables, or default to port 9000
app.listen(process.env.PORT || 9000, () => {
  console.log(`Server started on port ${process.env.PORT || 9000}. Ctrl+C to quit.`);
});
