const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var uniqueValidator = require ('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true}
}, {
    timestamps: true
});

UserSchema.plugin(uniqueValidator);

/*
UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});
*/

module.exports = mongoose.model('User', UserSchema)