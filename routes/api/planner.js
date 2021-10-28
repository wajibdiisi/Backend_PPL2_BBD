const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const key = require('../../config/key').secret;
const Wisata = require('../../model/Wisata');
const WisataPhoto = require('../../model/WisataPhoto');
const WisataController = require('../../controllers/WisataController.js');
const auth = require("../../middleware/auth");
const Planner = require('../../model/Planner');
const PlannerDetails = require('../../model/PlannerDetails');

router.get('/plan_list',auth, async (req,res) => {
    const planner = await Planner.find({id_user : req.userID})
    res.send(planner)
}),
router.post('/new_plan', auth, async (req, res) => {
       
    const newPlan = new Planner({
        title : req.body._value,
        id_user : req.userID
    })   
    newPlan.save()

})

router.patch('/plan/:id', auth, async (req,res) => {
    const update = { title: req.body._value };
    console.log(update)
    await Planner.findOneAndUpdate({
        _id : req.params.id
    },{title : req.body._value})
})          

router.delete('/plan/:id', auth, async(req , res) => {
  
    await Planner.findOneAndDelete({
        _id: req.params.id,
        id_user: req.userID
    }).then((response) => {
        return res.send(response)
    })     
});

router.get('/plan/:id', auth, async(req,res) => {
    const planner = await Planner.findOne({
        _id : req.params.id
    })
    res.send(planner)
})


router.get('/plan/:id/details', auth, async(req,res) => {
    const planner = await PlannerDetails.find({
        id_planner : req.params.id
    }).populate('id_wisata').exec()
    res.send(planner)
})

router.post('/plan/:id', auth, async(req,res)=> {
    let {
        wisata,
        time,
        date
    } = req.body._value
    const get_wisata = await Wisata.findOne({nama : wisata})
    const newDetails = await new PlannerDetails({
        id_wisata : get_wisata._id,
        time,
        id_planner : req.params.id,
        id_user : req.userID,
        date
    })
    if(newDetails != null){
        newDetails.save()
        return res.status(200).json({
            success: true,
            msg : "Plan has been created successfully"
        })
    }
    
})

router.patch('/plan/:id/:id_details', auth, async (req,res) => {
    let {
        wisata,
        time,
        date
    } = req.body._value
    const get_wisata = await Wisata.findOne({nama : wisata})

    await Planner.findOneAndUpdate({
        _id : req.params.id,
        id_user : req.userID
    },{
        wisata : get_wisata._id,
        time : time,
        date : date
    })
})    

router.delete('/plan/:id/:id_details', auth, async(req,res) => {
    await PlannerDetails.findOneAndDelete({
        _id: req.params.id_details,
        id_planner : req.params.id,
        id_user : req.userID,
    }).then((response) => {
        if(response != null){
            return res.status(200).json({
                success: true,
                msg: "Plan has been successfully deleted"
            });
    }
    }) 
})


module.exports = router;
