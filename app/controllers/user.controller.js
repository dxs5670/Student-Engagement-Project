const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateAPI = require('cloudmersive-validate-api-client');

//configure validateAPI client for user email address verification
const client = validateAPI.ApiClient.instance;
const apiKey = client.authentications['Apikey'];
apiKey.apiKey = 'ea4ba87f-18fc-4a8a-b8f9-cfe491707d0c';
var validate = new validateAPI.EmailApi();

// Create and Save a new User (register)
exports.create = (req, res) => {

        // Validate request
        if(!req.body.email || !req.body.password) {
            return res.status(400).send({
                message: "email and password fields can not be empty"
            });
        }
    
        // Create a User
        let user = new User({
            name: req.body.name || "New User",
            email: req.body.email,
            password: req.body.password
        });

        validate.emailPost(req.body.email, function(error, data, response) {
            if (error) {
                console.log(error);
            } else if (data.ValidAddress == false) {
                return res.status(400).send({ message: "email is invalid"});
            }
        });
        
        // Save User in the database
        user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

// authenticate login attempt
exports.authenticate = (req, res, next) => {
    User.findOne({email:req.body.email}, function(err, userInfo) {
        if (userInfo) {
            if(bcrypt.compareSync(req.body.password, userInfo.password)) {
                const token = jwt.sign({id:userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });
                res.json({status:"success", message: "user found", data: {user: userInfo, token: token}});
            } else {
                res.json({status: "error", message: "Invalid email or password", data: null});
            }     
        } else {
            res.json({status: "error", message: "User not found"});
        }
    });
};

// Retrieve and return all users from the database (admin function)
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single user with a userId (for matching event with person)
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Update a user identified by the userId in the request (for editing account details)
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "email or password fields can not be empty"
        });
    }

    // Find user and update with the request body
    User.findByIdAndUpdate(req.params.userId, {
        name: req.body.name || "New User",
        email: req.body.email,
        password: req.body.password
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
};

// Delete a user with the specified userId in the request (delete account)
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};