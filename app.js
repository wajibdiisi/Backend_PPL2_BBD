const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer')
const path = require('path');
const cors = require('cors');
const auth = require("./middleware/auth");
var upload = multer();
const passport = require('passport');
const listEndpoints = require('express-list-endpoints')

const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
  
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
app.use(upload.array()); 
app.use(passport.initialize());
// Bring in the Passport Strategy
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));

const db = require('./config/key').mongoURI;

mongoose.connect(db,{ useNewUrlParser:true}).then(() => {
    console.log(`Database Connected Success ${db}`);
}).catch(err => {
    console.log(`Unable to connect with the database ${err}`)
});

const PORT = process.env.PORT || 5000;


const users = require('./routes/api/users');
const wisata_api = require('./routes/api/wisata_api');
const review = require('./routes/api/review');
app.use('/api/users',users);
app.use('/api/wisata',wisata_api);
app.use('/api/review',review);
console.log(listEndpoints(app));
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})