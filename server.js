require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")
const path = require('path')

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})

const db = mongoose.connection

db.on ("error", (error) => console.error(error))
db.once('open',() => console.log("Connected to DB"))

app.use(express.json())

app.use('/upload',express.static(path.join(__dirname,'upload')))



require('./routes/user.routes.js')(app);
require('./routes/job.routes.js')(app);
require('./routes/message.routes.js')(app);
app.listen(3000, () => console.log("Server Started"))


