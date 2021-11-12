const express = require('express');
const router = express.Router();
const Wisata = require('../../model/Wisata');
const auth = require("../../middleware/auth");
const Planner = require('../../model/Planner');
const PlannerDetails = require('../../model/PlannerDetails');
const User = require('../../model/User');

router.get('/plan_list',auth, async (req,res) => {
    const planner = await Planner.find({id_user : req.userID})
    res.send(planner)
}),

router.get('/plan_list/:username', async(req,res) => {
    const user = await User.findOne({username : req.params.username})

    const planner = await Planner.find({id_user : user._id})
    res.send(planner)
})

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
        _id : req.params.id,
        id_user : req.userID
    })
    if(planner)
    res.send(planner)
    else{
        res.status(404).json({
            msg : "Planner not found"
        })
    }
})


router.get('/plan/:id/details', auth, async(req,res) => {

    const planner = await PlannerDetails.find({
        id_planner : req.params.id,
        id_user : req.userID
    }).populate('id_wisata').exec()
    if(planner){
    res.send(planner)
    }else {
        res.status(404).json({
            msg : "Planner not found"
        })
    }
})

router.post('/plan/:id', auth, async(req,res)=> {
    let {
        wisata,
        time,
        date,
        end_time,
    } = req.body._value
    const get_wisata = await Wisata.findOne({nama : wisata})
    const plannerCheck = await Planner.findOne({
        _id : req.params.id,
        id_user : req.userID
    })
    if(plannerCheck == null){
        res.status(404).json({
            msg : "Planner not found"
        })
    }else{
    const newDetails = await new PlannerDetails({
        id_wisata : get_wisata._id,
        time,
        id_planner : req.params.id,
        id_user : req.userID,
        end_time,
        date
    })
    if(newDetails != null){
        newDetails.save()
        return res.status(200).json({
            success: true,
            msg : "Plan has been created successfully"
        })
    }
}
    
})

router.patch('/plan/:id/:id_details', auth, async (req,res) => {
    let {
        wisata,
        time,
        date,
        end_time
    } = req.body._value
    const get_wisata = await Wisata.findOne({nama : wisata})
    console.log(get_wisata._id)
    const planner = await PlannerDetails.findOneAndUpdate({
        _id : req.params.id_details,
        id_planner : req.params.id,
        id_user : req.userID
    },{
        id_wisata : get_wisata._id,
        time : time,
        end_time : end_time,
        date : date
    })
    res.status(200).json({
        msg : "Plan Updated Successfully"
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
