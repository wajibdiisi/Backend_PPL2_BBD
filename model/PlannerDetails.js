const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    title: String,
    time: String,
    date: String,
    id_planner : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'planner'
    },
    id_wisata: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'wisata'
    },
    id_user : 
        {type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
        }
   });

module.exports = PlannerDetail = mongoose.model('plannerdetails', UserSchema,'plannerdetails');