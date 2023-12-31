const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/AnimeDatabase")
    .then(() => console.log("AnimeDatabase connected"))
    .catch((error) => console.error(`Error while connecting animedatabase =>>> ${error}`));

const animeSchema = mongoose.Schema({
    useremail: {
        type: String,
        required: true,
        unique: true
    },
    animeList: [
        {
            animeName: {
                type: String,
            },
            animeCategory: {
                type: String,
            },
            isComplete: {
                type: Boolean,
                default: false
            }
        }
    ]
});

const userInfo = mongoose.Schema({
    useremail: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const user_collection = new mongoose.model("userCollection", userInfo);
const anime_collection = new mongoose.model("animeCollection", animeSchema);

module.exports = { user_collection, anime_collection };