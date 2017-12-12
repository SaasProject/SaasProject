var config = require('config.json');
var express = require('express');
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
    console.log(req.user.sub);
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
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
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
                console.log("users.controller.js: TheCurrent USer is: ", user.username);
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
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }
 
    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }
 
    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}