const mongoose = require('mongoose');
const WisataPhoto = require('./WisataPhoto');
const Schema = mongoose.Schema;

const DiscussionSchema = new Schema({
    id_wisata : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'wisata'
    },
    id_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    title : String,
    content : {
        type : String
    },
    created_at: {
        type: Date,
        default : Date.now
    },
    id_comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'comments'
        }
    ],

    thumbs_up : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        }
    ]
});

module.exports = Discussion = mongoose.model('discussion', DiscussionSchema,'discussion');