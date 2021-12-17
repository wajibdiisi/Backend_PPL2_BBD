const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        select : false,
        required : true
    },
    provinsi: {
        type: String,
        //required : true
    },
    
    kota: {
        type: String,
        //required : true
    },
    tglLahir: {
        type: String,
        //required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    registered_date: {
        type: Date,
        default : Date.now
    },
    profilePicture : {
        type : String,
        default : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
    }
});

module.exports = User = mongoose.model('users', UserSchema);