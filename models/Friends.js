const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostsSchema = new Schema({
    friendoneid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'friendoneid'
    },
    friendtwoid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'friendtwoid'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('friends', PostsSchema)