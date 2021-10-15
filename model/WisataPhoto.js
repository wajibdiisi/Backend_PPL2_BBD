const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   id_wisata : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'wisata'
   },
   photo : String,
   description : String,
});

module.exports = WisataPhoto = mongoose.model('wisata_photos', UserSchema,'wisata_photos');