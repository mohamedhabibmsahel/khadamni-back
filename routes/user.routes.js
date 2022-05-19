const router = require('express').Router()
const multer = require("multer");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const picsPath = require("path").resolve(__dirname, "../upload");
module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./upload");
        },
        filename: (req, file, cb) => {
            var filetype = "";
            var fileExtension = "";
            if (file.mimetype === "image/gif") {
                filetype = "image-";
                fileExtension = "gif";
            }
            if (file.mimetype === "image/png") {
                filetype = "image-";
                fileExtension = "png";
            }
            if (file.mimetype === "image/jpeg") {
                filetype = "image-";
                fileExtension = "jpeg";
            }
            if (file.mimetype === "image/jpg") {
                filetype = "image-";
                fileExtension = "jpg";
            }
    
            cb(null, filetype + Date.now() + "." + fileExtension);
            h = cb;
        },
    });
    var upload = multer({
        storage: storage,
    });
    // Create a new Note
    app.post('/createuser',upload.single('urlImg'),user.create);
    app.post('/socialmedia',upload.single('urlImg')
    ,user.socialmedia);
    //forgetpassword
    app.post('/forgotPassword',user.getUserByMail,user.forgotPassword) 
    app.post('/resetPassword' ,user.resetPassword) 
 
    // Retrieve all Notes
    app.get('/allusers', user.findAll);

    // Retrieve a single Note with noteId
    app.get('/getuser/:userId', user.findOne);

    // Update a Note with noteId
    app.put('/updateuser/:userId',upload.single('urlImg')
    ,user.update);

    // Delete a Note with noteId
    //app.delete('/deleteuser/:userId', user.delete);
    app.delete ('/deleteuser/:id',user.getUserById,user.delete);

    //Login
    app.post('/loginClient', user.findclient)
    app.post ('/login',user.getUserByMail,user.login)

    app.get('/tokenaccount',user.findtoken)
    app.get('/tokenaccountall',user.findtokenall)

    app.get('/getuserEmail/:Email', user.findOneEmail);
    app.get('/getUserByMail/:Email', user.getUserByMail);
    app.get ('/getUserById/:id', user.getUserById );
    app.post('/sendmail',user.sendmaill)
    app.post('/sendsms',user.sendnumber)
    //auth
    app.post("/Auth",user.getUserByMail,user.Auth)
    app.get("/download/:nom",user.downloadimage)
}
