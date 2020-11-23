import React, {memo} from 'react';
import {CharacterItem} from "../character-item";
import {getCurrentUser} from "../../helpers/get-current-user";

export const CharactersList = memo(({ characters, homeWorlds }) => {
    const currentUserName = getCurrentUser();

    return (
        <ul>
            {
                characters.map(character => {
                    const { name: characterName, gender, homeworld } = character;
                    const url = homeworld.replace('http', 'https');

                    return (
                        <CharacterItem
                            key={characterName}
                            characterName={characterName}
                            gender={gender}
                            homeWorld={homeWorlds[url]}
                            characterData={character}
                            currentUserName={currentUserName}
                        />
                    );
                })
            }
        </ul>
    );
});