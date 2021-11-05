const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const auth = require("../../middleware/auth");
const Moment = require ('../../model/Moment')
const Wisata = require ('../../model/Wisata')
const upload = require("../../config/uploadFile");
const singleUpload = upload.single("file");
const Notification = require('../../model/Notification');


router.get('/:id_moment',async (req,res) => {
    const moment = await Moment.findOne({
        _id : req.params.id_moment
    }).populate('id_wisata id_user').exec()
    res.send(moment)
})

router.get('/random/moment', (req,res) => {
    Moment.findRandom({}, {}, {limit: 9, populate : 'id_wisata'}, function(err, results) {
        if (!err) {
            res.send(results) // 5 elements
        }
      });
})

router.get('/wisata/:slug',async (req,res) => {
    const wisata = await Wisata.findOne({
        slug : req.params.slug
    })

    const moment = await Moment.find({
        id_wisata : wisata._id
    }).populate('id_wisata id_user').sort({created_at : 'desc'}).exec()
    res.send(moment)
})

router.get('/user/:username',async  (req,res) => {
    const user = await User.findOne({
        username : req.params.username
    })
    const moment = await Moment.find({
        id_user : user._id
    }).populate('id_wisata id_user').sort({created_at : 'desc'}).exec()
    res.send(moment)
})

router.delete('/:id_moment', auth, async(req,res) => {
    const moment = await Moment.findOneAndDelete({
        id_user : req.userID,
        _id : req.params.id_moment
    }).then((response) => {
        return res.send(response.data)
    }).catch((err) => {
        return res.status(404).json({
            success : false,
            msg : "Discussion Not Found"
        })
    })
})

router.post('', auth, async(req,res) => {
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
          let {
            title,
            description,
            time,
            date,
            id_wisata
        } = req.body;
        const array = id_wisata.split(",")
        let newMoment = new Moment({
            title,
            description,
            time,
            date,
            id_wisata : array,
            id_user : req.userID,
            photo : req.file.location
        })
        newMoment.save().then(() => {
            res.status(201).json({
                msg : "Moment created successfully"
            })
        })
        }
        else{
          res.status(420).json({
              msg : 'Image not found'
          })
        }
      });
})

router.post('/:id_moment/thumbs',auth, async(req,res) => {
    const findMoment = await Moment.findOne({
        _id : req.params.id_moment,
        thumbs_up : req.userID
    })
    
    if(findMoment == null){
    const moment = await Moment.findOneAndUpdate({
        _id : req.params.id_moment
    }, {
        $addToSet: {
            "thumbs_up": req.userID
        },
    }, {
        safe: true,
        upsert: true,
        new: true
    },
        function (err, model) {
            if (err) {
                console.log(err);
                return res.send(err);
            } else {
                if(req.userID != model.id_user){
                    let id_moment = model._id
                    let id_user = model.id_user
                    let ref_user = req.userID
                    let content = 'likeMoment'
                    let newNotification = new Notification({
                        id_moment,
                        id_user,
                        ref_user,
                        content
                    });
                    newNotification.save()
                }
                return res.json(model);
            }
        }
    )}
    else{
        const moment = await Moment.findOneAndUpdate({
            _id : req.params.id_moment
        }, {
            $pull: {
                "thumbs_up": req.userID
            },
        }, {
            safe: true,
            upsert: true,
            new: true
        },
            function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    if(req.userID != model.id_user){
                     
                        let notif =  Notification.findOneAndDelete({
                            ref_user : req.userID,
                            id_moment : model._id
                        }).then(() => {
                            return res.json(model);
                        })
                    }
                    return res.json(model);
                }
            }
        )
    }
})

module.exports = router