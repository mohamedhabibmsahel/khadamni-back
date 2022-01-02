const router = require('express').Router()
const multer = require('../middleware/multer-config')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create a new Note
    app.post('/createuser', multer,user.create);
    app.post('/socialmedia',multer,user.socialmedia);
 
    // Retrieve all Notes
    app.get('/allusers', user.findAll);

    // Retrieve a single Note with noteId
    app.get('/getuser/:userId', user.findOne);

    // Update a Note with noteId
    app.put('/updateuser/:userId', multer,user.update);

    // Delete a Note with noteId
    app.delete('/deleteuser/:userId', user.delete);

    //Login
    app.post('/loginClient', user.findclient)

    app.get('/tokenaccount',user.findtoken)
    app.get('/tokenaccountall',user.findtokenall)

    app.get('/getuserEmail/:Email', user.findOneEmail);
    app.get('/getUserByMail/:Email', user.getUserByMail);
    

    app.post('/sendmail',user.sendmaill)
    app.post('/sendsms',user.sendnumber)
    //auth
    app.post("/Auth",user.getUserByMail,user.Auth)


}