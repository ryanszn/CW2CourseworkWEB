// auth.js

// Import necessary modules
const bcrypt = require("bcrypt"); // Library for hashing and comparing passwords
const userModel = require("../models/userModel"); // Importing the user model to interact with the database
const jwt = require("jsonwebtoken"); // Library for creating and verifying JSON Web Tokens (JWT)

// Exported function for handling user login
exports.login = function (req, res, next) {
  // Extract username and password from the request body
  let username = req.body.username;
  let password = req.body.password;

  // Look up the user in the database by username
  userModel.lookup(username, function (err, user) {
    if (err) {
      console.log("Error looking up user:", err);
      return res.status(401).send(); // Unauthorized
    }
    if (!user) {
      console.log("User", username, "not found");
      return res.render("user/register"); // User not found, render registration page
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.log("Error comparing passwords:", err);
        return res.status(500).send(); // Internal Server Error
      }
      if (result) {
        // Password matches
        let payload = { username: username, role: user.role };

        // Sign the payload into a JWT with a secret key and an expiration time of 300 seconds
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 300,
        });

        // Set the JWT as a cookie in the user's browser
        res.cookie("jwt", accessToken);

        // Render different views based on the user's role
        if (payload.role === "admin") {
          return res.render("admin", {
            title: "Admin dashboard",
            user: username, // Use dynamic username
          });
        }
        if (payload.role === "normalUser") {
          return res.render("newEntry", {
            title: "Guest Book",
            user: username, // Use dynamic username
          });
        }
        next(); // Proceed to the next middleware if no specific role is matched
      } else {
        return res.render("user/login"); // Password incorrect, render login page
      }
    });
  });
};

// Exported function for verifying that the user is authenticated
exports.verify = function (req, res, next) {
  let accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(403).send(); // Forbidden
  }

  try {
    // Verify and decode JWT
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = { username: payload.username, role: payload.role }; // Set req.user
    next(); // Token is valid, proceed to the next middleware
  } catch (e) {
    res.status(401).send(); // Unauthorized
  }
};

// Exported function for verifying that the user is an admin
exports.verifyAdmin = function (req, res, next) {
  let accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(403).send(); // Forbidden
  }

  try {
    // Verify and decode JWT
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = { username: payload.username, role: payload.role }; // Set req.user
    
    if (payload.role !== "admin") {
      return res.status(403).send(); // Forbidden
    }

    next(); // User is an admin, proceed to the next middleware
  } catch (e) {
    res.status(401).send(); // Unauthorized
  }
};
