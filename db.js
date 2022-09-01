const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://ankit:ankit12@cluster0.xte92t8.mongodb.net/webchat";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,{useNewUrlParser: true,
        useUnifiedTopology: true,} ).then(() => {console.log("Connected to Mongo Successfully")})
}

module.exports = connectToMongo;

