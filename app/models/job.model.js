const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    nom: String,
    description: String,
    price: String,
    time: String,
    idClient:String
}, {
    timestamps: true
});

module.exports = mongoose.model('job', JobSchema);