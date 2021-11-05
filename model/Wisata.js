const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

const WisataSchema = new Schema({
    nama_wisata: String,
    lokasi: String,
    slug: String,
    bookmark_id_user : [
        {type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
        }
    ],
    photo : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'wisata_photos'
    }
    ],
    world_coordinate: String,
    description: String,
    Openhour: String,
    avg_cost: String,
    Tag: [],
    Contact : String,
});

WisataSchema.plugin(random)

module.exports = Wisata = mongoose.model('wisata', WisataSchema,'wisata');