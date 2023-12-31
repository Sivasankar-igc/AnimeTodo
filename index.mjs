import express from "express";
import { user_collection, anime_collection } from "./database.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";

const web = express();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

web.use(express.urlencoded({ extended: false }));
web.use(express.json());
web.use(cors());

web.post("/addNewAnime", async (req, res) => {
    try {
        const { animeName, animeCategory, email } = req.body;

        const isUserExist = await anime_collection.findOne({ useremail: email });

        if (isUserExist !== null) {
            let isAnimeNameExist = false;
            let listSize = isUserExist.animeList.length;

            for(let i=0; i<listSize; i++){
                if(isUserExist.animeList[i].animeName == animeName.toUpperCase()){
                    isAnimeNameExist = true;
                    break;
                }
            }

            if(!isAnimeNameExist){
                const data = await anime_collection.updateOne({ useremail: email }, {
                    $push: {
                        animeList: {
                            animeName: animeName.toUpperCase(),
                            animeCategory: animeCategory
                        }
                    }
                })
                
                data != null ? res.status(200).send(true) : res.status(200).send(false);
            }
            else {
                res.status(200).send("anime_exist");
            }
        } else{
            res.status(200).send(false);
        }

    } catch (error) {
        console.error(`Error while adding new anime to the list and the error is : ${error}`)
    }
})

web.post("/getAnimeList", async (req, res) => {
    try {
        const { email } = req.body;
        const data = await anime_collection.findOne({ useremail: email });

        data !== null ? res.status(200).send(data) : res.status(200).send(null);
    } catch (error) {
        console.error(`Error occured while retrieving the anime list =>>> ${error}`);
    }
})

web.post("/deleteAnime", async (req, res) => {
    try {
        const { email, animeName } = req.body;

        const data = await anime_collection.updateOne({ useremail: email }, {
            $pull: {
                animeList: {
                    animeName: animeName
                }
            }
        });

        data.modifiedCount == 1 ? res.status(200).send(true) : res.status(200).send(false);
    } catch (error) {
        console.error(`Error occured while deleting the anime =>>> ${error}`);
    }
})

web.post("/animeComplete", async (req, res) => {
    try {
        const { email, animeName } = req.body;
        const data = await anime_collection.updateOne({
            $and: [
                { useremail: email },
                { animeList: { $elemMatch: { animeName: animeName.toUpperCase() } } }
            ]
        }, { $set: { "animeList.$.isComplete": true } });

        data.modifiedCount == 1 ? res.status(200).send(true) : res.status(200).send(false);
    } catch (error) {
        console.error(`error occured while performing anime complete operation =>>> ${error}`);
    }
})

web.post("/showFilteredAnimes", async (req, res) => {
    try {
        const { email, animeCategory } = req.body;
        let animeList = await anime_collection.findOne({ useremail: email });
        let animes = [];

        if (animeCategory == "watched") {

            animeList.animeList.forEach(anime => {
                if (anime.isComplete == true) {
                    animes.push(anime);
                }
            })
            animes != null ? res.status(200).send(animes) : res.status(200).send(null);

        } else if (animeCategory == "all") {
            animeList != null ? res.status(200).send(animeList.animeList) : res.status(200).send(null);
        } else {

            animeList.animeList.forEach(anime => {
                if (anime.animeCategory == animeCategory) {
                    animes.push(anime);
                }
            })
            animes != null ? res.status(200).send(animes) : res.status(200).send(null);
        }
    } catch (error) {
        console.error(`error occured while filtering the anime =>>> ${error}`);
    }
})

web.post("/signin", async (req, res) => {
    try {
        const { useremail, username, password } = req.body;
        const user = await user_collection.findOne({ useremail: useremail });

        if (user === null) {
            const data = new user_collection({
                useremail: useremail,
                username: username,
                password: password
            });

            const dataSaved = await data.save();
            await new anime_collection({ useremail: useremail, animeList: [] }).save();

            dataSaved !== null ? res.status(200).send(true) : res.status(200).send(false);
        }
        else {
            res.status(200).send("trytologin");
        }
    } catch (error) {
        console.error(`error occured while signing the user =>>> ${error}`)
    }
})

web.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userdata = await user_collection.findOne({ useremail: email, password: password });

        userdata !== null ? res.status(200).send(true) : res.status(200).send(false);
    } catch (error) {
        console.error(`erroc occured while loggin the user account =>>> ${error}`);
    }
})

web.use(express.static(path.join(__dirname, "./frontend/dist")))
web.get("*", (req,res)=>{
    try {
        res.sendFile(path.join(__dirname, "./frontend/dist/index.html"))
    } catch (error) {
        console.log(`error in getting the frontend file ==> ${error}`)
    }
})

web.listen(PORT, () => console.log(`server listening at port number ${PORT}`))