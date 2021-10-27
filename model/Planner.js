const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    title: String,
    id_user : 
        {type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
        }
   });

module.exports = Planner = mongoose.model('planner', UserSchema,'planner');