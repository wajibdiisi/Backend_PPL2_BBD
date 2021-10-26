const mongoose = require('mongoose');
const WisataPhoto = require('./WisataPhoto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id_wisata : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'wisata'
    },
    id_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    description : String,
    rating : Number,
    content : {
        type : String
    },
    date: {
        type: Date,
        default : Date.now
    },

    thumbs_up : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        }
    ]
});

module.exports = Wisata = mongoose.model('review', UserSchema,'review');