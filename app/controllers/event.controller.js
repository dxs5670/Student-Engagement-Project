const Event = require('../models/user.model.js');


// PRIVATE ROUTE - MUST BE LOGGED IN
// Create and Save a new Event (POST)
exports.create = (req, res) => {

    // Check for required fields
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('eventDate', 'Event date is required').notEmpty();

    // Capture errors in variable 'errors'
    let errors = req.validationErrors();

    // If there are errors, reload the page. Else, create an event object named 'event'
    if(errors) {
        res.render('createEvent', {
            title: 'Create an event',
            errors: errors
        });
    } else {
        let event = new Event({
                title: req.body.title,
                organization: req.body.organization || "Penn State",
                description: req.body.description,
                eventDate: req.body.eventDate,
                postDate: new Date() || event.body.postDate,
                location: req.body.location,
                userID: req.user._id
        });

        // Save the event, or send an error message to the page
        event.save(function(err) {
            if(err) {
                req.flash('danger', 'There was an error saving your event')
                console.log(err);
                return;
            } else {
                req.flash('success', 'Event has been created successfully');
                res.redirect('/');
            }
        });
    }
};




// Retrieve and return all events from the database. (GET all)
exports.findAll = (req, res) => {
    Event.find()
    .then(events => {
        res.send(events);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving events."
        });
    });
};

// Find a single event with an eventId (GET one)
exports.findOne = (req, res) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(!event) {
            return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
            });            
        }
        res.send(event);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving event with id " + req.params.eventId
        });
    });
};


// PRIVATE ROUTE - MUST BE LOGGED IN
// Update a event identified by the eventId in the request (PUT)
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.title || !req.body.eventDate || !req.body.description) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }

    // Find event and update it with the request body
    Event.findByIdAndUpdate(req.params.eventId, {
        title: req.body.title,
        organization: req.body.organization || "Penn State",
        description: req.body.description,
        eventDate: req.body.eventDate,
        postDate: new Date() || req.body.postDate,
        location: req.body.location,
        userID: req.user._id
    }, {new: true})
    .then(event => {
        if(!event) {
            return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
            });
        }
        res.send(event);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
            });                
        }
        return res.status(500).send({
            message: "Error updating event with id " + req.params.eventId
        });
    });
};


// PROTECTED ROUTE - MUST BE LOGGED IN
// Delete an event with the specified eventId in the request (DELETE)
exports.delete = (req, res) => {
    Event.findByIdAndRemove(req.params.eventId)
    .then(event => {
        if(!event) {
            return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
            });
        }
        res.send({message: "Event deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
            });                
        }
        return res.status(500).send({
            message: "Could not delete event with id " + req.params.eventId
        });
    });
};

