module.exports = (app) => {
    const events = require('../controllers/event.controller.js');

    // Create a new Event (private)
    app.post('/events', ensureAuthenticated, events.create);


    
    // Retrieve all Events
    app.get('/events', events.findAll);

    // Retrieve a single Event with eventId
    app.get('/events/:eventId', events.findOne);



    // Update a Event with eventId (private)
    app.put('/events/:eventId', ensureAuthenticated, events.update);

    // Delete a Event with eventId (private)
    app.delete('/events/:eventId', ensureAuthenticated,  events.delete);
}

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/signIn')
    }
}