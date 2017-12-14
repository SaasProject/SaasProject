var config = require('config.json');
var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var userService = require('services/user.service');
 
// routes
router.get('/isAdmin', getAdminUser);
router.get('/all', getAllUsers);
router.post('/authenticate', authenticateUser);
router.post('/emailOn', emailOn);       // added by dyan0
router.post('/addUser', addUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
 
module.exports = router;

function getAllUsers(req, res) {
    userService.getAll(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
// added by dyan0
function emailOn(req, res) {
    console.log(req.body);
    userService.emailOn(req.body)
        .then(function (emailDBstat) {
            console.log(req.body.email);
            res.status(200).send(emailDBstat);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
// end of add - dyan0


function addUser(req, res) {
    userService.insert(req.body)
        .then(function () {
            sendingMail();
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

        //sending the email
        function sendingMail(){
            const output = `
                <p>This mail contains your account's details</p>
                <h3> Account Details</h3>
                <ul>
                    <li>First name: ${req.body.firstName}</li>
                    <li>Last name: ${req.body.lastName}</li>
                    <li>User name: ${req.body.username}</li>
                    <li>Email: ${req.body.email}</li>
                    <li>Temporary Password: ${req.body.password}</li>
                </ul>
                <h3>IMPORTANT!</h3>
                <p>Please change your password as soon as possible.</p>
                <p>You are registered as ${req.body.role}</p>
            `;
        
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'saasteamaws@gmail.com', // generated ethereal user
                    pass: 'Ibinigay na to ni dyan0'  // generated ethereal password
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"SaaS Team 👻" <saasteamaws@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Account Registered ✔', // Subject line
                text: 'Welcome to SaaS Project', // plain text body
                html: output // html body
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });
        }
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// Added by Glenn
// This is to determine if user is admin or not.
function getAdminUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if(user) {
                if (user.role == 'Admin') {
                    console.log("users.controller.js: The user is admin");
                    res.send(true);
                } else {
                    console.log("users.controller.js: The user is not admin");
                    res.send(false);
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function updateUser(req, res) {
    var userId = req.params._id
 
    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function deleteUser(req, res) {
    var userId = req.params._id
 
 
    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}