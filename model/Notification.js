const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    id_discussion : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'discussion'
    },
    id_moment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'moments'
    },
    id_review : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'review'
    },
    id_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    ref_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
    },
    content : {
        type : String
    },
    created_at: {
        type: Date,
        default : Date.now
    },

  
});

module.exports = Notification = mongoose.model('notification', NotificationSchema,'notification');