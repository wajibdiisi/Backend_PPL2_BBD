const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id_discussion : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'discussion'
    },
    id_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    content : {
        type : String
    },
    created_at: {
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

module.exports = Comment = mongoose.model('comments', CommentSchema,'comments');