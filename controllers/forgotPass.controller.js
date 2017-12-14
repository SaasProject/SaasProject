// By dyan0


var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
const nodemailer = require('nodemailer');
 
router.get('/', function (req, res) {
    // log user out
    delete req.session.token;
 
    // move success message into local variable so it only appears once (single read)
    var viewData = { success: req.session.success };
    delete req.session.success;
 
    res.render('login', viewData);
});
 
router.post('/', function (req, res) {
    var crypto = require("crypto");
    var tempPass = crypto.randomBytes(4).toString('hex');
    req.body.tempPass = tempPass;

    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/emailOn',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }
 
        if (!response.body) {
            return res.render('login', { error: 'email address is not registered', email: req.body.email });
        }

       sendingMail(response.body) ;

        // return to login page with success message
        req.session.success = 'Email sent';
 
        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);



        //sending the email
        function sendingMail(temp){
            const output = `
                <p>This mail is sent to recover your account</p>
                <h3> Account Details</h3>
                <ul>
                    <li>Email: ${req.body.email}</li>
                    <li>Temporary Password: ${temp}</li>
                </ul>
                <h3>Message</h3>
                <p>${req.body.message}</p>
            `;
        
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'saasteamaws@gmail.com', // generated ethereal user
                    pass: '12angDum^^y'  // generated ethereal password
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"SaaS Team 👻" <saasteamaws@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });
        }

    });
});
 
module.exports = router;

