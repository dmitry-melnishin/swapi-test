import React, {useEffect, useState} from "react";
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import "./character-profile.css";

const FILMS = 'films';
const VEHICLES = 'vehicles';
const LOADING_FILMS = 'loading films...';
const LOADING_VEHICLES = 'loading vehicles...';

export const CharacterProfile = params => {
    const [films, setFilms] = useState(LOADING_FILMS);
    const [vehicles, setVehicles] = useState(LOADING_VEHICLES);
    const [characterImage, setCharacterImage] = useState(null);

    const { characterData, homeWorld } = params.location.state;
    const { name, height, mass, hair_color, skin_color, eye_color, birth_year, gender } = characterData;
    const characteristics = [
        name, height, mass, hair_color, skin_color, eye_color,
        birth_year, gender, homeWorld, vehicles, films
    ];

    const getCharacteristic = (characteristicData, characteristicName) => {
        return characteristicData.reduce((accum, characteristic, i) => {
            const isLast = characteristicData.length - 1 === i;
            const sign = isLast ? '' : ', ';

            switch (characteristicName) {
                case FILMS:
                    return `${accum}${characteristic.title}${sign}`;
                case VEHICLES:
                    return `${accum}${characteristic.name} - ${characteristic.model}${sign}`;
            }
        }, '');
    }

    const getCharacteristicData = ({ urls, characteristicName, setData }) => {
        const requests = urls.map(url => fetch(url.replace('http', 'https')));

        Promise.all(requests)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(characteristicData => {
                setData(getCharacteristic(characteristicData, characteristicName));
            })
            .catch(err => console.error(err))
    }

    const handleImportImage = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (upload) => {
            setCharacterImage(upload.target.result);
        };

        reader.readAsDataURL(file);
    }

    useEffect(() => {
        getCharacteristicData({
            urls: characterData[VEHICLES],
            characteristicName: VEHICLES,
            setData: setVehicles
        });
        getCharacteristicData({
            urls: characterData[FILMS],
            characteristicName: FILMS,
            setData: setFilms
        });
    }, []);

    return (
        <article className="profile-wrapper">
            <div>
                <input
                    className="hidden"
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={handleImportImage}
                />
                <label htmlFor="icon-button-file">
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                    >
                        <PhotoCamera />
                    </IconButton>
                </label>
                {
                    characterImage &&
                    <img
                        src={characterImage}
                        alt="character-image"
                        width={150}
                    />
                }
            </div>
            <ol>
                {
                    characteristics.map(characteristic => (
                        <li key={characteristic}>{characteristic}</li>
                    ))
                }
            </ol>
        </article>
    );
}