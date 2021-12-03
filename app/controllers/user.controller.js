const User = require('../models/user.model.js');

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const saltRounds = 10;
// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.nom) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }
  
    // Create a Note
    let newuser = new User({
        nom : req.body.nom || "Untitled Note",
        prenom : req.body.prenom ,
        email :req.body.email ,
        password :req.body.password ,
        phone :req.body.phone ,
        address :req.body.address,
        job :req.body.job,
        urlImg : req.body.urlImg
        
    });
// Hash password before saving in database
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newuser.password, salt, (err, hash) => {
      if (err) throw err;
      newuser.password= hash;
      newuser.save()
        
        .then(client => res.json(client))
        .catch(err => console.log(err));
    });
  });
  
  
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
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

// Find a single note with a noteId
exports.findOneEmail = (req, res) => {
    
    User.find({email: req.params.Email})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.Email
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.Email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.Email
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.nom) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
  
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password , salt);
    console.log(hash)
    // Find note and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        nom : req.body.nom || "Untitled Note",
        prenom : req.body.prenom ,
        email :req.body.email ,
        password :hash,
        phone :req.body.phone ,
        address :req.body.address,
        job :req.body.job,
        urlImg : req.body.urlImg
    }, {new: true})
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
            message: "Error updating note with id " + req.params.userId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.userId
        });
    });
};


// Find a single note with a noteId
exports.findclient = (req, res) => {
    // Find client by email
    User.findOne({email: req.body.email}).then(client => {
        // Check if client exists
        if (!client) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }
      // Check password
          bcrypt.compare(req.body.password, client.password).then(isMatch => {
            if (isMatch) {
              // client matched
              // Create JWT Payload
              const payload = {
                id: client._id,
                email : client.email
              };
      // Sign token
              jwt.sign(
                payload,
                "secret",
                {
                  expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token:"Bearer "+ token,
                
                    id : client._id
                  });
                }
              );
            } else {
              return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
            }
          });
        });
};


// Find a single note with a noteId
exports.findtoken = (req, res) => {
   
    const headers = req.headers['authorization']
    console.log(headers)
    if(headers) {
      // Bearer oabsdoabsoidabsiodabsiodbasoid
      const token = headers.split(' ')[1]
      const decoded = jwt.verify(token, 'secret')
      
      if(decoded) {
        let username = decoded.id
        console.log("////////////////////////////////////////////////////")
        console.log(username)
        User.findById(username)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });            
            }
            res.send(note);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + username
            });
        });
      } else {
        res.json({message: 'Unauthorized access'})
      }
      
    } else {
      res.json({message: 'Unauthorized access'})
    }
};

exports.findtokenall = (req, res) => {
   
    const headers = req.headers['authorization']
    console.log(headers)
    if(headers) {
      // Bearer oabsdoabsoidabsiodabsiodbasoid
      const token = headers.split(' ')[1]
      const decoded = jwt.verify(token, 'secret')
      
      if(decoded) {
        let username = decoded.id
        console.log("////////////////////////////////////////////////////")
        console.log(username)
        User.find()
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });            
            }
            res.send(note);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + username
            });
        });
      } else {
        res.json({message: 'Unauthorized access'})
      }
      
    } else {
      res.json({message: 'Unauthorized access'})
    }
};


// send mail
exports.sendmaill = (req, res) => {
   
  
    async function main() {
   
        let transporter = nodemailer.createTransport({
          service: 'gmail',
         
          auth: {
              user: 'gouidersaif@gmail.com',
              pass: 'saifOUN10'
          },
       });
      
     
       
      // send mail with defined transport object
      let info = await transporter.sendMail({
          from: 'gouidersaif@gmail.com',
          to: req.body.email,
          subject: 'Verification account',
          text: req.body.code
      });
      console.log("Message sent: %s", info.messageId);
     
    }
    main().catch(console.error);
  
  
};


  
//send SMS


exports.sendnumber = (req, res) => {
   
const nexmo = new Nexmo({
    apiKey: "d3311679",
  apiSecret: "AyEH3YNyBayZZ552"
});
var to = '21627621983';
var from = 'KHADEMNI';
var text = req.body.code;


nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
  
};