import React, {useState} from "react";
import {Context} from "../../context";
import {FbStatus} from "../../components/fb-status";
import {SearchField} from "../../components/search-field";
import {LikedCharacters} from "../../components/liked-characters";

export const Home = () => {
    const [likedCharacters, setLikedCharacters] = useState([]);

    return (
        <Context.Provider value={setLikedCharacters}>
            <FbStatus />
            <SearchField />
            <LikedCharacters likedCharacters={likedCharacters} />
        </Context.Provider>
    );
}