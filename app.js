const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer')
var multerS3 = require('multer-s3')
const path = require('path');
const cors = require('cors');
const auth = require("./middleware/auth");
const aws = require('aws-sdk')
aws.config.update({
  secretAccessKey :  process.env.AWS_IAM_USER_SECRET,
  accessKeyId: process.env.AWS_IAM_USER_KEY
})
s3 = new aws.S3();
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'mytour-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      console.log(file)
      cb(null, Date.now().toString())
    }
  })
});
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
  app.use(express.json()) 
app.use(express.urlencoded({extended: true}));
//app.use(upload.array()); 
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
const planner = require('./routes/api/planner');
const location = require('./routes/api/location');
const notification = require('./routes/api/notification');
app.use('/api/users',users);
app.use('/api/wisata',wisata_api);
app.use('/api/review',review);
app.use('/api/planner',planner);
app.use('/api/location',location);
app.use('/api/notification',notification);
console.log(listEndpoints(app));
app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  next(err)
})
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
