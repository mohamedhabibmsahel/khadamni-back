const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nom: {
        type: String
    },
    prenom: {
        type: String
    },
    email: {
        required:true,
        type: String,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String
    },
    phone:{
        unique: true,
        maxlength: 12,
        type: String
    },
    job:{
        type: String,
        required: false
    },
    urlImg:{
        type: String,
        required: false
    }
    
    
})

module.exports = mongoose.model('user',userSchema)