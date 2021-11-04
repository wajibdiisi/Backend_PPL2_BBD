const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MomentSchema = new Schema({
    id_wisata : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'wisata'
    }],
    id_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    title : {
        type : String
    },
    description : {
        type : String
    },
    created_at: {
        type: Date,
        default : Date.now
    },
    date : {
        type : String
    },
    time : {
        type : String
    },
    photo : {
        type : String
    },



    thumbs_up : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        }
    ]
});

module.exports = Moment = mongoose.model('moments', MomentSchema,'moments');