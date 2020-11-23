import React from "react";
import {getThumbData} from "../../helpers/get-thumb-data";

export const LikedCharacters = ({ likedCharacters }) => {
    const thumbData = getThumbData();
    const uniquesLikedCharacters = [];

    for (const name in thumbData) {
        const isLike = !!thumbData[name].likes.quantity;

        if (isLike && !likedCharacters.includes(name)) {
            uniquesLikedCharacters.push(name);
        }
    }

    likedCharacters.forEach(name => {
        uniquesLikedCharacters.push(name);
    });

    return (
        uniquesLikedCharacters.length
            ? (
                <>
                    <h4>Liked Characters:</h4>
                    <ul>
                        {
                            uniquesLikedCharacters.map(characterName => (
                                <li key={characterName}>{characterName}</li>
                            ))
                        }
                    </ul>
                </>
            )
            : null
    );
}