const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const Notification = require('../../model/Notification');


router.get('/', auth, async (req,res) => {
    const notification = await Notification.find({id_user : req.userID}).populate('id_user ref_user')
    .populate({path : 'id_review',
        populate : {
            path: 'id_wisata',
            model : 'wisata'
        }
    }).
    populate({path : 'id_discussion', populate : {
        path:'id_wisata',
        model : 'wisata'
    }})
    .sort({created_at : 'desc'}).exec()
    res.send(notification)
})

router.delete('/:id_notification', auth, async(req,res) =>{
    const notification = await Notification.findOneAndDelete({_id : req.params.id_notification, id_user : req.userID}).then((response) => {
        return res.status(201).json({
            success: true,
            msg: "Notification Deleted Sucessfully"
        });
    }).catch((err) => {
        return res.status(404).json({
            success : false,
            msg : "Notification Not Found"
        })
    })

})

router.delete('/remove/all', auth, async(req,res) => {
    console.log(req.userID)
    await Notification.deleteMany({id_user : req.userID}).then(() => {
    return res.status(201).json({
        success: true,
        msg: "Notification Deleted Sucessfully"
    });
}).catch((err) => {
    return res.status(404).json({
        success : false,
        msg : "Notification Not Found"
    })
})
})

module.exports = router;