import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/homePage.css";
import { useLocation } from "react-router-dom";

const HomePage = () => {

    const [animeName, setAnimeName] = useState("");
    const [animeList, setAnimeList] = useState([]);
    const loc = useLocation();

    if (loc.state !== null) {
        const email = loc.state.useremail;

        useEffect(() => {

            axios.post("http://localhost:8000/getAnimeList", { email })
                .then((res) => setAnimeList(res.data.animeList))
                .catch((error) => console.error(`Error occured while fetching anime list =>>> ${error}`));
        }, [])

        // THIS METHOD WILL BE CALLED WHEN THE USER CLICKS THE COMPLETE BUTTON
        const animeComplete = (animeName) => {
            axios.post("http://localhost:8000/animeComplete", { email, animeName })
                .then((res) => res.data ? location.reload() : window.alert("Something went wrong..."))
                .catch((error) => window.alert("Something went wrong..."));
        }
        // ------------------------------------------------------END OF COMPLETE ANIME METHOD-------------------------------------------------------


        // THIS METHOD WILL BE CALLED WHEN THE USER CLICKS THE DELETE BUTTON
        const deleteAnime = (animeName) => {
            axios.post("http://localhost:8000/deleteAnime", { email, animeName })
                .then((res) => res.data == 1 ? location.reload() : window.alert("Something went wrong..."))
                .catch((error) => window.alert("Something went wrong..."));
        }
        //-------------------------------------------------------END OF DELETE ANIME METHOD---------------------------------------------------------


        // THIS METHOD WILL DISPLAY A BOX OF ALL POSSIBLE CATEGORIES TO BE SELECTED BY THE USER TO PERFORM FILTER OPERATION

        const showFilteredItem = (item, animeCategory) => {
            document.querySelector(".filter .select-opt .selected-opt").innerText = item.innerText;
            rotateArrow(document.querySelector(".filter .select-opt .arrow-mark"));

            axios.post("http://localhost:8000/showFilteredAnimes", { email, animeCategory })
                .then((res) => {
                    if (res.data != null) {
                        setAnimeList(res.data);
                    } else {
                        window.alert("Something went wrong.....")
                    }
                })
                .catch((error) => window.alert("Couldn't retrieve the filtered Animes...."));

        }
        //-----------------------------------------------------------END OF SHOWING FILTER ITEMS-----------------------------------------------------


        // THIS METHOD WILL DISPLAY THE VARIOUS POSSIBLE ANIME CATEGORIES like running, new season yet to arrived and finished
        const showAnimePref = () => {
            document.querySelector(".after").style.display = "block";
        }
        //--------------------------------------------END OF SHOWING ANIME CATEGORY METHOD----------------------------------------------------------

        // THIS METHOD WILL ADD A NEW ANIME WITH THEIR RESPECTIVE CATEGORY i.e. ANIME ANIME :- BLEACH, CATEGORY :- NEW SEASON YET TO ARRIVED
        const addAnime = (animeCategory) => {
            axios.post("http://localhost:8000/addNewAnime", { animeName, animeCategory, email })
                .then((res) => {
                    if (res.data == true) {
                        location.reload();
                    } else if (res.data == false) {
                        window.alert("Something went wrong...");
                    } else if (res.data == "anime_exist") {
                        window.alert("Anime is already exist");
                    }
                })
                .catch((error) => window.alert(`There is an error while adding anime =>>> ${error}`))
        }
        //-------------------------------------------------------------END OF ADDING NEW ANIME METHOD------------------------------------------------


        //THIS METHOD ROTATES THE CARET MARK AFTER THE USER CLICKS THE CARET BUTTON
        const rotateArrow = (arrow) => {

            let dropDownList = document.querySelector(".filter .opt-list");

            if (dropDownList != null) {
                setTimeout(() => {
                    dropDownList.classList.toggle("showList");
                }, 200)
                arrow.classList.toggle("rotate-arrow");
            }
        }
        //--------------------------------------------------------------------END OF ROTATING CARET BUTTON METHOD------------------------------------


        return (
            <>
                <section className="wrapper">
                    <div className="addTask">
                        <input type="text" className="anime-name" onChange={(e) => setAnimeName(e.target.value)} />
                        <button type="button" onClick={() => showAnimePref()}>Add an anime</button>
                    </div>
                    <div className="after" style={{ display: "none" }}>
                        <button onClick={() => addAnime("finished")}>Finished</button>
                        <button onClick={() => addAnime("new_season_yet_to_arrived")}>New Season yet to arrived</button>
                        <button onClick={() => addAnime("running")}>Running</button>
                    </div>
                    <div className="taskContainer">
                        <header>ANIME LIST</header>
                        <div className="filter">
                            <div className="select-opt">
                                <div className="selected-opt">All</div>
                                <div className="arrow-mark" onClick={(e) => rotateArrow(e.target)}></div>
                            </div>
                            <ul className="opt-list">
                                <li onClick={(e) => showFilteredItem(e.target, "finished")}>Finished</li>
                                <li onClick={(e) => showFilteredItem(e.target, "running")}>Running</li>
                                <li onClick={(e) => showFilteredItem(e.target, "new_season_yet_to_arrived")}>New Season Yet To Arrived</li>
                                <li onClick={(e) => showFilteredItem(e.target, "watched")}>Watched</li>
                                <li onClick={(e) => showFilteredItem(e.target, "all")}>All</li>
                            </ul>
                        </div>
                        <div className="tasks-wrapper">
                            {
                                animeList.length != 0 ? animeList.map((anime, index) => (

                                    anime.isComplete
                                        ? <div className="task" style={{ backgroundColor: "green" }} key={index}>
                                            <p>{anime.animeName}</p>
                                            <button onClick={() => deleteAnime(anime.animeName)}>Delete</button>
                                        </div>
                                        : <div className="task" key={index}>
                                            <p>{anime.animeName}</p>
                                            {anime.isComplete ? "" : <button onClick={() => animeComplete(anime.animeName)}>Complete</button>}
                                            <button onClick={() => deleteAnime(anime.animeName)}>Delete</button>
                                        </div>
                                )) : ""
                            }
                        </div>
                    </div>
                </section>
            </>
        )
    }


}

export default HomePage;