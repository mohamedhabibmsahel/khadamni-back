const Message = require('../models/message.model.js');
//create a new message
exports.create = (req, res) => {
    // Validate request
    if(!req.body.description) {
        return res.status(400).send({
            message: "message content can not be empty"
        });
    }
  
    // Create a message
    let newmessage = new Message({
        from : req.body.from || "Untitled Note",
        to : req.body.to ,
        description :req.body.description ,
        time : req.body.time
        
    });
    newmessage.save()
    };
    //retourner tous les messages
    exports.findAll = (req, res) => {
        Message.find()
        .then(messages => {
            res.send(messages);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
    };
    // Find a single note with a noteId
exports.findOne = (req, res) => {
    Message.findById(req.params.userId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.userId
        });
    });
};