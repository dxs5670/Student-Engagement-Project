const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    title: String,
    organization: String,
    description: String,
    eventDate: Date,
    postDate: Date,
    location: String,
    userID: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventScehema)