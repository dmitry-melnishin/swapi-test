import React, {memo, useEffect, useRef, useState} from "react";
import debounce from "lodash.debounce";
import {CharactersList} from "../characters-list";

export const SearchField = memo(() => {
    const [searchText, setSearchText] = useState('');
    const [characters, setCharacters] = useState([]);
    const homeWorldUrls = useRef(new Set());
    const homeWorlds = useRef({});

    const handleChange = debounce(event => {
        setSearchText(event.target.value);
    }, 300);


    const handleHomeWorldRequests = charactersData => {
        const homeWorldRequests = charactersData.reduce((accum, character) => {
            const url = character.homeworld.replace('http', 'https');

            if (!homeWorldUrls.current.has(url)) {
                homeWorldUrls.current.add(url);

                return [...accum, fetch(url)];
            }

            return accum;
        }, []);

        Promise.all(homeWorldRequests)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(worlds => {
                worlds.forEach(({ name, url }) => {
                    homeWorlds.current[url.replace('http', 'https')] = name;
                });

                setCharacters(charactersData);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        if (searchText) {
            fetch(`https://swapi.dev/api/people/?search=${searchText}`)
                .then(res => res.json())
                .then(data => {
                    handleHomeWorldRequests(data.results);
                })
                .catch(err => console.error(err))
        } else {
            setCharacters([]);
        }
    }, [searchText]);

    return (
        <>
            <input
                type="text"
                onChange={handleChange}
            />
            <CharactersList
                characters={characters}
                homeWorlds={homeWorlds.current}
            />
        </>
    );
});