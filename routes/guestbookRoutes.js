// guestbookRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/guestbookControllers'); // Import the guestbook controller functions.
const auth = require('../auth/auth'); // Import the authentication middleware.

// Ensure all controller methods are defined
const checkControllerMethods = () => {
  const requiredMethods = [
    'show_login', 'handle_login', 'render_about_charity_page',
    'show_new_entries', 'post_new_entry', 'show_user_entries',
    'show_register_page', 'post_new_user', 'loggedIn_landing',
    'logout', 'show_admin', 'admin_add_new_user', 'admin_post_new_user',
    'render_contact_page', 'show_delete_user_page', 'delete_user',
    'show_delete_entry_page', 'delete_entry', 'show_charity_page',
    'landing_page' // Ensure this method is included
  ];
  requiredMethods.forEach(method => {
    if (typeof controller[method] !== 'function') {
      console.error(`Controller method ${method} is missing or not a function.`);
    }
  });
};

checkControllerMethods();

// Route definitions
router.get('/login', controller.show_login);
router.post('/login', auth.login, controller.handle_login);
router.get("/", controller.render_about_charity_page);
router.get('/new', auth.verify, controller.show_new_entries); // New entry route
router.post('/new', auth.verify, controller.post_new_entry);  // Handle new entry form submission
router.get('/posts/:author', controller.show_user_entries);
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get("/loggedIn", auth.verify, controller.loggedIn_landing);
router.get("/logout", controller.logout);
router.get("/admin", auth.verifyAdmin, controller.show_admin);
router.get("/adminPostNewUser", auth.verifyAdmin, controller.admin_add_new_user);
router.post("/adminPostNewUser", auth.verifyAdmin, controller.admin_post_new_user);
router.get("/contact", controller.render_contact_page);
router.get('/deleteUser', auth.verifyAdmin, controller.show_delete_user_page);
router.post('/deleteUser', auth.verifyAdmin, controller.delete_user);
router.get('/deleteEntry', auth.verifyAdmin, controller.show_delete_entry_page);
router.post('/deleteEntry', auth.verifyAdmin, controller.delete_entry);
router.get('/charity', auth.verify, controller.show_charity_page);

// Add the route for entries landing page
router.get('/entries', controller.landing_page); // Ensure this route is defined correctly

// 404 Error handler
router.use((req, res) => {
  res.status(404).type('text/plain').send('404 Not found.');
});

// 500 Error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).type('text/plain').send('Internal Server Error.');
});

module.exports = router;
