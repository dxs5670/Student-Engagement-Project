// Dependencies
const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validateAPI = require('cloudmersive-validate-api-client');


// configure validateAPI client for user email address verification
const client = validateAPI.ApiClient.instance;
const apiKey = client.authentications['Apikey'];
apiKey.apiKey = 'ea4ba87f-18fc-4a8a-b8f9-cfe491707d0c';
var validate = new validateAPI.EmailApi();

/*~~~~~~~~~
  CREATE
~~~~~~~~~*/

// Create and Save a new User (register) (POST)
exports.create = (req, res, next) => {

    // possible fields
    const email = req.body.email;
    const password = req.body.password;

    //check for nonempty fields
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password cannot be blank').notEmpty();

    // populate errors for empty fields and invalid email address
    let errors = req.validationErrors();
    let emailError = validate.emailPost(email, function(error, data, response) {
        if (error) {
            console.log('here');
            return 'error';
        } else if (data.ValidAddress == false) {
            console.log('or here');
            return 'error';
        } else {
            return;
        }
    });
    
    // Create newUser object if no errors
    if (errors || emailError) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: req.body.name || "New User",
            email: req.body.email,
            password: req.body.password
        });
    

        // Hash the password and save the user 
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err) {
                    if (err) {
                        req.flash('danger', 'User is already registered')
                        res.redirect('/signIn');
                    } else {
                        req.flash('success', 'You are registered and now can log in');
                        res.redirect('/signIn')
                    }
                });
            });
        });
    }
};


/*~~~~~~~~~~~
  LOGIN/OUT
~~~~~~~~~~~*/


// authenticate login attempt
exports.authenticate = (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            console.log(info);
            return res.redirect('/signIn'); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/account');
        });
      })(req, res, next);
};

// logout user
exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/signIn');
};


/*~~~~~~~~~
    PUT
~~~~~~~~~*/

// Update a user identified by the userId in the request (for editing account details)
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "email or password fields can not be empty"
        });
    }


    // Find user and update with the request body
    User.find(({email: req.params.email }), {
        name: req.body.name || "New User",
        email: req.body.email,
        password: req.body.password
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });                
        }
        return res.status(500).send({
            message: "Error updating user with email " + req.params.email
        });
    });
};

/*~~~~~~~~~
  DELETE
~~~~~~~~~*/


// Delete a user with the specified userId in the request (delete account)
exports.delete = (req, res) => {
    User.find({email: req.params.email})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with email " + req.params.email
        });
    });
};







/*~~~~~~~~~
    GET
~~~~~~~~~*/




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


