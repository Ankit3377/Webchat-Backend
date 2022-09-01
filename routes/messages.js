const express = require('express');
const router = express.Router();
var fetchuser = require('../middlewere/fetchuser');
const { body, validationResult } = require('express-validator');
const Messages = require('../models/Messages');
const Friends = require('../models/Friends');
const User = require('../models/User');


//Route 1: Get all the messages using: GET "/api/message/fetchallmessages". Login required
router.get('/fetchallmessages', fetchuser, async (req, res) => {
    const messages = await Messages.find();

    const friends = await Friends.find();
    
    const users = await User.find().select("-password -email");

    let newMessages = []
    let index1 = 0;
    let indexRightMessages = 0
    messages.forEach(element => {
        if (element.senduserid.toString() === req.user.id) {
            newMessages[index1] = { id: element._id, indexrightmessages: indexRightMessages, message: element.message, position: "right", userid: element.recieveuserid, date: element.date };
            index1++;
            indexRightMessages++;
        }
        else if (element.recieveuserid.toString() === req.user.id) {
            newMessages[index1] = { id: element._id, message: element.message, position: "left", userid: element.senduserid, date: element.date };
            index1++;
        }
    });

    
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

    res.json([newMessages, newFriends, users]);
})




//Route 2: Add a new post using: POST "/api/auth/addpost". Login required
router.post('/addmessage', fetchuser, async (req, res) => {

    try {

        const { recieveuserid, message } = req.body;

        // If there are errors, return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = new Messages({
            senduserid: req.user.id, recieveuserid, message
        })
        await post.save();
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");

    }
})

//Route 2: Add a new post using: POST "/api/auth/addpost". Login required
router.post('/addfriend', fetchuser, async (req, res) => {

    try {

        const { friendtwoid } = req.body;

        // If there are errors, return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // const checkFriend = await Friends.find({friendtwoid});

        // if(checkFriend){
        //     return res.status(400).json({ error: "Friend already exists" });
        // }

        const friend = new Friends({
            friendoneid: req.user.id, friendtwoid
        })
        const savedfriend = await friend.save();
        res.json(savedfriend);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");

    }
})

module.exports = router;