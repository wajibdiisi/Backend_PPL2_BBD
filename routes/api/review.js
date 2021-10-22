const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const key = require('../../config/key').secret;
const Wisata = require('../../model/Wisata');
const WisataPhoto = require('../../model/WisataPhoto');
const WisataController = require('../../controllers/WisataController.js');
const auth = require("../../middleware/auth");
const Review = require('../../model/Review');

router.get('/:id_wisata', async (req,res) => {
    const review = await Review.find({id_wisata : req.params.id_wisata})
    res.send(review)
}),




module.exports = router;
