const router = require('express').Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
module.exports = (app) => {
    const message = require('../controllers/message.controller.js');

     // Create a new message
     app.post('/createmessage', message.create);
         // Retrieve all message
     app.get('/allmessage', message.findAll);
     // Retrieve a single message with noteId
     app.get('/getmessage/:userId', message.findOne);

}