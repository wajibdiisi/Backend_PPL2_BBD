const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const key = require('../../config/key').secret;
const Wisata = require('../../model/Wisata');
const WisataPhoto = require('../../model/WisataPhoto');
const WisataController = require('../../controllers/WisataController.js');
const auth = require("../../middleware/auth");
const Planner = require('../../model/Planner');

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


module.exports = router;
