const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const key = require('../../config/key').secret;
const Wisata = require('../../model/Wisata');
const WisataPhoto = require('../../model/WisataPhoto');
const WisataController = require('../../controllers/WisataController.js');
const auth = require("../../middleware/auth");
const Review = require('../../model/Review');

router.get('/all', async (req, res) => {
    const wisata = await Wisata.find()
    res.send(wisata)
}),
    router.get('/:slug', async (req, res) => {
        const wisata = await Wisata.findOne({
            slug: req.params.slug
        })
        res.send(wisata)
    }),

    router.get('/:slug/images', async (req, res) => {
        const wisata = await Wisata.findOne({
            slug: req.params.slug
        }).populate('bookmark_id_user photo').exec();
        res.send(wisata);
    })

router.get('/:slug/test', async (req, res) => {
    const wisata = await Wisata.findOne({
        slug: req.params.slug
    }).populate('bookmark_id_user').exec();
    res.send(wisata);
}),

    options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };

router.get('/:slug/review', async (req, res) => {
    const wisata = await Wisata.findOne({
        slug: req.params.slug
    }).exec();
    const review = await Review.find({
        id_wisata: wisata._id
    }).populate('id_user').exec();
    res.send(review);
}),

    router.post('/:slug/review', auth, async (req, res) => {
        const wisata = await Wisata.findOne({
            slug: req.params.slug
        });

        await Review.findOne({
            id_wisata: wisata._id,
            id_user: req.userID

        }).then(review => {
            if (review) {
                console.log(review)
                return res.status(400).json({
                    msg: "Review made by this user is already exists"
                });
            } else {
                let id_wisata = wisata._id;
                let id_user = req.userID;

                let {
                    description,
                    rating,
                    content
                } = req.body;
                console.log(content)
                let newReview = new Review({
                    id_wisata,
                    id_user,
                    description,
                    content,
                    rating
                });
                newReview.save().then(user => {
                    return res.status(201).json({
                        success: true,
                        msg: "Review Created Sucessfully"
                    });
                });
            }
        });

    });

    router.delete('/:slug/review/', auth, async(req , res) => {
        const wisata = await Wisata.findOne({
            slug: req.params.slug
        });

        await Review.findOneAndDelete({
            id_wisata: wisata._id,
            id_user: req.userID
        }).then((response) => {
            return res.send(response.data)
        })     
    });

router.post('/:slug/review/:review_id/thumbs', auth, async (req, res) => {
    const review = await Review.findOneAndUpdate({
        _id: req.params.review_id
    }, {
        $addToSet: {
            "thumbs_up": req.userID
        }
    }, {
        safe: true,
        upsert: true,
        new: true
    },
        function (err, model) {
            if (err) {
                console.log(err);
                return res.send(err);
            } else {
                return res.json(model);
            }
        }
    )
}),

router.post('/:slug/add_bookmark/', auth, async (req, res) => {
        await Wisata.findOneAndUpdate({
            slug: req.params.slug
        }, {
            $addToSet: {
                "bookmark_id_user": req.userID
            }
        }, {
            safe: true,
            upsert: true,
            new: true
        },
            function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else
                    return res.json(model);
            }

        )

    })
router.post('/:slug/remove_bookmark/', auth, async (req, res) => {
    await Wisata.findOneAndUpdate({
        slug: req.params.slug
    }, {
        $pull: {
            "bookmark_id_user": req.userID
        }
    }, {
        safe: true,
        upsert: true,
        new: true
    },
        function (err, model) {
            if (err) {
                console.log(err);
                return res.send(err);
            } else
                return res.json(model);
        }

    )

})
module.exports = router;