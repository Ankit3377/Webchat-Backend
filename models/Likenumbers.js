const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostsSchema = new Schema({
    userids:{
        type: Array,
    },
    postid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userid'
    },
    number: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('likenumber', PostsSchema)