const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    from: String,
    to: String,
    description: String,
    time:Date
}, {
    timestamps: true
});

module.exports = mongoose.model('message', MessageSchema);