const express = require('express');
const router = express.Router();
var fetchuser = require('../middlewere/fetchuser');
var Posts = require('../models/Posts');
var User = require('../models/User');
var Comments = require('../models/Comments');
var Likenumbers = require('../models/Likenumbers');
const { body, validationResult } = require('express-validator');
const Friends = require('../models/Friends');

//Route 1: Get all the todo using: GET "/api/auth/fetchalltodo". Login required
router.get('/fetchallposts', fetchuser, async (req, res) => {
    const posts = await Posts.find();
    const users = await User.find().select("-password -email");
    const likeNumbers = await Likenumbers.find();
    const comments = await Comments.find();
    const friends = await Friends.find();

    const newFriends = [];
    let index2 = 0;
    friends.forEach(element => {
        if (element.friendoneid.toString() === req.user.id) {
            newFriends[index2] = { id: element._id, friendid: element.friendtwoid };
            index2++;
        }
        else if (element.friendtwoid.toString() === req.user.id) {
            newFriends[index2] = { id: element._id, friendid: element.friendoneid };
            index2++;
        }
    });


    const newUsers = [];
    let index3 = 0;
    let check1 = false;
    users.forEach(element1 => {
        friends.forEach(element2 => {
            if( ((element2.friendoneid.toString() === req.user.id) && (element2.friendtwoid.toString() === element1._id.toString())) || ((element2.friendtwoid.toString() === req.user.id) && (element2.friendoneid.toString() === element1._id.toString())) ){
                check1 = true;
            }
        });
        if ((element1._id.toString() === req.user.id) || check1) {
            check1 = false;
        }
        else {
            newUsers[index3] = element1;
            index3++;
        }
    });

    const newCheckLikes = [];
    let index4 = 0, check2 = false;
    likeNumbers.forEach(element1 => {
        element1.userids.forEach(element2 => {
            if (element2.toString() === req.user.id) {
                check2 = true;
            }
            else{
                check2 = false;
            }
        });
        if (check2) {
            newCheckLikes[index4] = { postid: element1.postid, liked: true, number: element1.userids.length };
            index4++;
        }
        else {
            newCheckLikes[index4] = { postid: element1.postid, liked: false, number: element1.userids.length };
            index4++;
        }
    });

    const currentUser = users.find(x => x._id.toString() === req.user.id);
    res.json([posts, users, newCheckLikes, comments, newFriends, newUsers, currentUser]);
})

//Route 2: Add a new post using: POST "/api/auth/addpost". Login required
router.post('/addpost', fetchuser, async (req, res) => {

    try {

        const { title, url } = req.body;

        // If there are errors, return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = new Posts({
            title, url, user: req.user.id
        })
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");

    }
})

//Route 3: Update an existing post using: PUT "/api/auth/updatepost00". Login required
router.post('/addcomment', fetchuser, async (req, res) => {
    try {

        const { userid, postid, comment } = req.body;

        // If there are errors, return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const addComment = new Comments({
            userid, postid, comment
        })
        const savedComment = await addComment.save();
        res.json(savedComment);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");

    }
})

//Route 3: Update an existing post using: PUT "/api/auth/updatepost00". Login required
router.post('/addlikenumbers', fetchuser, async (req, res) => {
    try {

        const { postid, number } = req.body;

        // If there are errors, return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userids = [];
        const addLikeNumbers = new Likenumbers({
            userids, postid, number
        })
        const savedLikeNumbers = await addLikeNumbers.save();
        res.json(savedLikeNumbers);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");

    }
})


//Route 3: Update an existing note using: PUT "/api/auth/updatenote". Login required
router.put('/updatelikenumbers', fetchuser, async (req, res) => {
    const { postid } = req.body;
    try {
        

        const userid = req.user.id;

        //Find the Likenumbers to be updated and update it
        let likeNumbers = await Likenumbers.findOne({ postid });
        if (!likeNumbers) { return res.status(404).send("Not Found"); }
        let index = 0;
        do {
            if (likeNumbers.userids[index] === req.user.id){
                await Likenumbers.findOneAndUpdate( {_id: likeNumbers._id}, { $pull: {userids: userid} }, { new: true });
            }
            else {
                await Likenumbers.findOneAndUpdate( {_id: likeNumbers._id}, { $push: {userids: userid} }, { new: true });
            }
            index++;
        } while (index<likeNumbers.userids.length);


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");

    }
})




module.exports = router;