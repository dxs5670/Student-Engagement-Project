module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    // Authenticate Login
    app.post('/authenticate', users.authenticate);

    // Logout
    app.get('/logout', ensureAuthenticated, users.logout)

    // Retrieve all Users
    app.get('/users', users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', users.findOne);

    // Update a User with userId
    app.put('/users/:userId', ensureAuthenticated, users.update);

    // Delete a User with userId
    app.delete('/users/:userId', ensureAuthenticated, users.delete);

}

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/signIn')
    }
}