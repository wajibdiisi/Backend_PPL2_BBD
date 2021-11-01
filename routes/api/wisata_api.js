const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const key = require('../../config/key').secret;
const Wisata = require('../../model/Wisata');
const WisataPhoto = require('../../model/WisataPhoto');
const WisataController = require('../../controllers/WisataController.js');
const Discussion = require("../../model/Discussion");
const Comment = require("../../model/Comment");
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
    const countRating = await Review.find({
        id_wisata: wisata._id
    }).select({rating : 1, _id : 0}).exec();

    res.send({
        data : review,
        count : countRating,
    });
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

router.post('/:slug/discussion',auth, async (req, res) => {
    const wisata = await Wisata.findOne({
        slug: req.params.slug
    });
    let id_wisata = wisata._id;
    let id_user = req.userID;
    let {
        title,
        content
    } = req.body;
    let newDiscussion = new Discussion({
        id_wisata,
        id_user,
        title,
        content,
    });
    newDiscussion.save().then(user => {
        return res.status(201).json({
            success: true,
            msg: "Review Created Sucessfully"
        });
    });

})
router.delete('/:slug/discussion/:id_discussion', auth, async(req , res) => {
  

    await Discussion.findOneAndDelete({
        id_user : req.userID,
        _id : req.params.id_discussion
    }).then((response) => {
        return res.send(response.data)
    }).catch((err) => {
        return res.status(404).json({
            success : false,
            msg : "Discussion Not Found"
        })
    })
});

router.get('/:slug/discussion', async (req, res) => {
    const wisata = await Wisata.findOne({
        slug: req.params.slug
    });
    const discussion = await Discussion.find({
        id_wisata : wisata._id
    }).populate('id_user')
        .populate({path : 'id_comments',
        populate : {
            path: 'id_user',
            model : 'users'
        }
    }).exec();
    res.send(discussion)

})

router.get('/:slug/discussion/:id_discussion', async (req,res) => {
    const discussion = await Discussion.findOne({
        _id : req.params.id_discussion
    }).populate('id_user')
        .populate({path : 'id_comments',
        populate : {
            path: 'id_user',
            model : 'users'
        }
    }).exec();
    res.send(discussion)
})

router.post('/:slug/discussion/:id_discussion',auth, async (req, res) => {
    const wisata = await Wisata.findOne({
            slug : req.params.slug
        });
       
    let id_wisata = wisata._id;
    let id_user = req.userID;
    let id_discussion = req.params.id_discussion;
    let {
        content
    } = req.body;
    let newComment = new Comment({
        id_wisata,
        id_user,
        id_discussion,
        content,
    });
    
    const commentID = await newComment.save(async function(err,room){
        await Discussion.findOneAndUpdate({
            _id : id_discussion
        }, {
            $addToSet: {
                "id_comments": room._id
            }
        }, {
            upsert: true,
            new : true,
        },
            function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else
                return res.status(201).json({
                    success: true,
                    msg: "Comment Created Sucessfully"
                });
            }
    
        )
    })
    
})

router.delete('/:slug/discussion/:id_discussion/:id_comment',auth, async(req,res ) => {
    console.log(req.userID)
    console.log(req.params.id_comment)
    console.log(req.params.id_discussion)
    await Comment.findOneAndDelete({
        id_user : req.userID,
        _id : req.params.id_comment,
        id_discussion : req.params.id_discussion
    }).then(async (response) => {
        await Discussion.findOneAndUpdate({
            _id : req.params.id_discussion
        }, {
            $pull :{
                'id_comments' : req.params.id_comment
            }},
            {
                safe: true,
                upsert:true,
                new : true
            }
        ).then((response) => {
            res.status(201).json({
                success : true,
                msg : "Comment Deleted"
            })
        })
    }).catch((err) => {
        return res.status(404).json({
            success : false,
            msg : "Discussion Not Found"
        })
    })
})

module.exports = router;