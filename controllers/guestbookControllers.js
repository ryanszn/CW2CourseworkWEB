// Import necessary modules
const GuestBook = require("../models/guestbookModel"); // Correctly import the GuestBook class
const userDao = require("../models/userModel.js"); // Import the User data access object (DAO)

// Initialize the guestbook database
const db = new GuestBook("guestbook.db"); // Use the correct class constructor

// Render the login page
exports.show_login = function (req, res) {
  res.render("user/login"); // Render the login view
};

// Handle user login based on their role
exports.handle_login = function (req, res) {
  if (req.user.role === "charity") {
    // If the user has a charity role, render the charity view with products
    db.getAllEntries()
      .then((products) => {
        res.render("charity", {
          title: "Charity",
          user: req.user.username,
          products: products, // Pass products to the view
        });
      })
      .catch((err) => {
        console.error("Error fetching products:", err); // Log any errors encountered during the process
        res.status(500).send("Error fetching products."); // Send a 500 Internal Server Error if an error occurs
      });
  } else {
    // Otherwise, render the guest book entry view for normal users
    res.render("newEntry", {
      title: "Guest Book",
      user: req.user.username,
    });
  }
};

// Display the landing page with all guestbook entries
exports.landing_page = function (req, res) {
  db.getAllEntries()
    .then((list) => {
      res.render("entries", {
        title: "Guest Book",
        entries: list,
      });
    })
    .catch((err) => {
      console.error("Error fetching entries:", err); // Log any errors encountered during the process
      res.status(500).send("Error fetching entries."); // Send a 500 Internal Server Error if an error occurs
    });
};

// Render the page for creating new entries
exports.show_new_entries = function (req, res) {
  try {
    // Verify user authentication through cookies
    if (!req.cookies.jwt) {
      return res.redirect('/login'); // Redirect to login if JWT cookie is not present
    }

    // Assuming req.user is set by middleware, if not, extract from JWT
    const username = req.user ? req.user.username : "Guest";

    res.render('newEntry', {
      title: "Add New Product", // Customize the title as needed
      user: username, // Pass the dynamic username to the view
    });
  } catch (error) {
    console.error('Error rendering new entry page:', error.message);
    res.status(500).send('Error rendering new entry page.');
  }
};

// Handle the submission of a new guestbook entry
exports.post_new_entry = function (req, res) {
  const { author, itemName, contents, price } = req.body;

  // Ensure that all required fields are provided
  if (!author || !itemName || !contents || !price) {
    return res.status(400).send("All fields must be filled."); // Validate that all fields are present
  }

  db.addEntry(author, itemName, contents, price)
    .then(() => {
      res.redirect("/loggedIn"); // Redirect after successful entry
    })
    .catch((err) => {
      console.error("Error adding entry:", err);
      res.status(500).send("Error adding entry.");
    });
};

// Show all entries by a specific user
exports.show_user_entries = function (req, res) {
  const user = req.params.author; // Get the author's name from the request parameters
  db.getEntriesByAuthor(user)
    .then((entries) => {
      res.render("entries", {
        title: "Guest Book",
        user: req.user.username, // Use dynamic user information
        entries: entries,
      });
    })
    .catch((err) => {
      console.error("Error fetching user entries:", err); // Log any errors in JSON format
      res.status(500).send("Error fetching user entries.");
    });
};

// Render the registration page
exports.show_register_page = function (req, res) {
  res.render("user/register"); // Render the registration view
};

// Handle the creation of a new user
exports.post_new_user = function (req, res) {
  const { username, pass: password, role } = req.body;

  // Ensure that both username and password are provided
  if (!username || !password) {
    return res.status(400).send("Username or password missing"); // Send a 400 Bad Request if either is missing
  }

  userDao.lookup(username, function (err, existingUser) {
    if (err) {
      console.error("Error looking up user:", err); // Log any errors during the lookup process
      return res.status(500).send("Error looking up user"); // Send a 500 Internal Server Error if an error occurs
    }

    if (existingUser) {
      return res.status(409).send("User already exists"); // Send a 409 Conflict if the user already exists
    }

    // Create the new user in the database
    userDao.create(username, password, role, function (err) {
      if (err) {
        console.error("Error creating user:", err); // Log any errors during the creation process
        return res.status(500).send("Error creating user"); // Send a 500 Internal Server Error if an error occurs
      }

      // Render a view indicating that the user has been added
      res.render("userAdded", {
        title: "User Added",
        user: req.user.username, // Pass user info to the view
        message: "User has been successfully added.", // Custom message
      });
    });
  });
};

// Render the landing page for logged-in users, showing all guestbook entries
exports.loggedIn_landing = function (req, res) {
  db.getAllEntries()
    .then((list) => {
      res.render("entries", {
        title: "Guest Book",
        user: req.user.username, // Use dynamic user information
        entries: list,
      });
    })
    .catch((err) => {
      console.error("Error fetching entries:", err); // Log any errors encountered during the process
      res.status(500).send("Error fetching entries.");
    });
};

// Handle user logout by clearing the JWT cookie and redirecting to the homepage
exports.logout = function (req, res) {
  res.clearCookie("jwt").status(200).redirect("/"); // Clear the JWT cookie and redirect to the homepage
};

// Render the admin dashboard with a list of all users
exports.show_admin = function (req, res) {
  userDao.getAllUsers()
    .then((list) => {
      res.render("admin", {
        title: "Admin Dashboard",
        user: req.user.username, // Use dynamic user information
        users: list,
      });
    })
    .catch((err) => {
      console.error("Error fetching users:", err); // Log any errors encountered during the process
      res.status(500).send("Error fetching users.");
    });
};

// Render the page for adding a new user as an admin
exports.admin_add_new_user = function (req, res) {
  res.render("addUser", {
    user: req.user.username, // Use dynamic user information
  });
};

// Handle the creation of a new user by the admin
exports.admin_post_new_user = function (req, res) {
  const { username, pass: password, role } = req.body;

  // Ensure that both username and password are provided
  if (!username || !password) {
    return res.status(400).send("Username or password missing"); // Send a 400 Bad Request if either is missing
  }

  userDao.lookup(username, function (err, existingUser) {
    if (err) {
      console.error("Error looking up user:", err); // Log any errors during the lookup process
      return res.status(500).send("Error looking up user"); // Send a 500 Internal Server Error if an error occurs
    }

    if (existingUser) {
      return res.status(409).send("User already exists"); // Send a 409 Conflict if the user already exists
    }

    // Create the new user in the database
    userDao.create(username, password, role, function (err) {
      if (err) {
        console.error("Error creating user:", err); // Log any errors during the creation process
        return res.status(500).send("Error creating user"); // Send a 500 Internal Server Error if an error occurs
      }

      // Render a view indicating that the user has been added
      res.render("userAdded", {
        title: "User Added",
        user: req.user.username, // Pass user info to the view
        message: "User has been successfully added.", // Custom message
      });
    });
  });
};

// Render the "About Charity" page
exports.render_about_charity_page = function (req, res) {
  res.render("aboutCharity"); // Render the about charity view
};

// Render the charity page
exports.show_charity_page = function (req, res) {
  res.render('charity'); // Ensure 'charity.mustache' exists in the 'views' directory
};

// Render the contact page
exports.render_contact_page = function (req, res) {
  res.render("contact"); // Render the contact view
};

// Render the page for deleting a user
exports.show_delete_user_page = function (req, res) {
  userDao.getAllUsers()
    .then((users) => {
      res.render("deleteUser", { users: users });
    })
    .catch((err) => {
      console.error("Error fetching users:", err); // Log any errors encountered during the process
      res.status(500).send("Error fetching users.");
    });
};

// Handle the deletion of a user
exports.delete_user = function (req, res) {
  const userId = req.body.userId; // Get the user ID from the request body
  userDao.deleteUser(userId, function (err) {
    if (err) {
      console.error("Error deleting user:", err); // Log any errors encountered during the process
      return res.status(500).send("Error deleting user."); // Send a 500 Internal Server Error if an error occurs
    }
    res.redirect("/deleteUser"); // Redirect to the delete user page after successful deletion
  });
};

// Render the page for deleting a guestbook entry
exports.show_delete_entry_page = function (req, res) {
  db.getAllEntries()
    .then((entries) => {
      res.render("deleteEntry", { entries: entries });
    })
    .catch((err) => {
      console.error("Error fetching entries:", err); // Log any errors encountered during the process
      res.status(500).send("Error fetching entries.");
    });
};

// Handle the deletion of a guestbook entry
exports.delete_entry = function (req, res) {
  const entryId = req.body.entryId; // Get the entry ID from the request body
  db.deleteEntry(entryId)
    .then(() => {
      res.redirect("/deleteEntry"); // Redirect to the delete entry page after successful deletion
    })
    .catch((err) => {
      console.error("Error deleting entry:", err); // Log any errors encountered during the process
      res.status(500).send("Error deleting entry.");
    });
};
