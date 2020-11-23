import React, {memo} from "react";
import {Link} from "react-router-dom";
import {Thumbs} from "../thumbs";

export const CharacterItem = memo(({
    characterName,
    gender,
    homeWorld,
    characterData,
    currentUserName
}) => {
    return (
        <li>
            <Link to={{
                pathname: `/character-profile/${characterName}`,
                state: { characterData, homeWorld }
            }}>
                {`${characterName} (gender - ${gender}, home world - ${homeWorld})`}
            </Link>
            <Thumbs
                characterName={characterName}
                currentUserName={currentUserName}
            />
        </li>
    )
});