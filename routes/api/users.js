const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const auth = require("../../middleware/auth");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/key').secret;
const passport = require('passport');
//const { upload } = require('../../config/upload'); 

const upload = require("../../config/uploadFile");
const singleUpload = upload.single("file");

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
 router.post('/register', (req, res) => {
    let {
        name,
        password,
        confirm_password,
        email,
        username,
        //location,
        //tahun_lahir
    } = req.body
    if (password !== confirm_password) {
        return res.status(406).json({
            msg: "Password do not match."
        });
    }
    // Check for the unique Username
 
    // Check for the Unique Email
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(406).json({
                msg: "Email is already registered. Please choose another one."
            });
        }
    });
    User.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(406).json({
                msg: "Username is already registered. Please choose another one."
            });
        }
    });
    // The data is valid and new we can register the user
    let newUser = new User({
        name,
        email,
        username,
        password,
        //location,
        //tahun_lahir
    });
    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "Hurry! User is now registered."
                });
            });
        });
    });
});

router.patch('/update_profile', auth, async (req,res) => {
    singleUpload(req, res, function (err) {
        if (err) {
          return res.json({
            success: false,
            errors: {
              title: "Image Upload Error",
              detail: err.message,
              error: err,
            },
          });
        }
        if(req.file){
        User.findOneAndUpdate({
            _id : req.userID
        },{
            name : req.body.name,
            email : req.body.email,
            provinsi : req.body.provinsi,
            kota : req.body.kota,
            tglLahir : req.body.tglLahir,
            profilePicture: req.file.location 
        },(err,doc) => {
            if(err) console.log(err)
        }).then((response) =>{
            res.status(200).json({
                msg : 'Update Berhasil'
            })
        })}
        else{
            User.findOneAndUpdate({
                _id : req.userID
            },{
                name : req.body.name,
                email : req.body.email,
                provinsi : req.body.provinsi,
                kota : req.body.kota,
                tglLahir : req.body.tglLahir
            },(err,doc) => {
                if(err) console.log(err)
            }).then((response) => {
               return res.status(201).json({
                   success : "true",
                   msg : "Data Updated Successfully"
               })
            })
            console.log('tes')
        }
      });
})
router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                msg: "Email is not found.",
                success: false
            });
        }
        // If there is user we are now going to compare the password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
                jwt.sign(payload, key, {
                    expiresIn: "10h"
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`,
                        user: user,
                        msg: "Hurry! You are now logged in."
                    });
                })
            } else {
                return res.status(404).json({
                    msg: "Incorrect password.",
                    success: false
                });
            }
        })
    });
});
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log(req.body)
    return res.json({
        user: req.user
    });
});
router.get('/profile/:username', async (req, res) => {
    const getUser = await User.findOne({username : req.params.username}).then(
        response => {
            if(!response){
                return res.status(404).json({
                    msg : "User Not Found"
                })
            }else {
               return res.send(response)
            }
        }
    )
    
}),

module.exports = router;
