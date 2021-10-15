const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    location: {
        type: String,
        //required : true
    },
    tahun_lahir: {
        type: String,
        //required : true
    },
    registered_date: {
        type: Date,
        default : Date.now
    }
});

module.exports = User = mongoose.model('users', UserSchema);