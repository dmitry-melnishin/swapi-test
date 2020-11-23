import React, {memo, useContext, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {getThumbData} from "../../helpers/get-thumb-data";
import {setThumbData} from "../../helpers/set-thumb-data";
import {Context} from "../../context";

const LIKE = 'LIKE';
const DISLIKE = 'DISLIKE';
const THUMB_UP = '\uD83D\uDC4D';
const THUMB_DOWN = '\uD83D\uDC4E';

export const Thumbs = memo(({ characterName, currentUserName }) => {
    const [likeQty, setLikeQty] = useState(0);
    const [dislikeQty, setDislikeQty] = useState(0);
    const setLikedCharactersContext = useContext(Context);

    const buttonsData = [
        { quantity: likeQty, text: THUMB_UP, handler: () => handleThumb(LIKE) },
        { quantity: dislikeQty, text: THUMB_DOWN, handler: () => handleThumb(DISLIKE) }
    ];

    const getFirstThumbClickData = (thumbData, isLike) => {
        return {
            ...thumbData,
            [characterName]: {
                likes: {
                    quantity: isLike ? 1 : 0,
                    likedUsers: isLike ? [currentUserName] : []
                },
                dislikes: {
                    quantity: isLike ? 0 : 1,
                    dislikedUsers: isLike ? [] : [currentUserName]
                }
            }
        };
    }

    const getNewThumbData = (thumbData, isLike) => {
        const isCurUserClickedLikeBefore = thumbData[characterName].likes.likedUsers.includes(currentUserName);
        const isCurUserClickedDislikeBefore = thumbData[characterName].dislikes.dislikedUsers.includes(currentUserName);
        const likesQtyBefore = thumbData[characterName].likes.quantity;
        const dislikesQtyBefore = thumbData[characterName].dislikes.quantity;
        const likedUsersBefore = thumbData[characterName].likes.likedUsers;
        const dislikedUsersBefore = thumbData[characterName].dislikes.dislikedUsers;

        let likesQuantity;
        let dislikeQuantity;
        let likedUsers;
        let dislikedUsers;

        if (isLike) {
            likesQuantity = isCurUserClickedLikeBefore ? likesQtyBefore - 1 : likesQtyBefore + 1;
            dislikeQuantity = isCurUserClickedDislikeBefore ? dislikesQtyBefore - 1 : dislikesQtyBefore;
            likedUsers = isCurUserClickedLikeBefore
                ? likedUsersBefore.filter(userBefore => userBefore !== currentUserName)
                : [...likedUsersBefore, currentUserName];
            dislikedUsers = isCurUserClickedDislikeBefore
                ? dislikedUsersBefore.filter(userBefore => userBefore !== currentUserName)
                : dislikedUsersBefore
        } else {
            likesQuantity = isCurUserClickedLikeBefore ? likesQtyBefore - 1 : likesQtyBefore;
            dislikeQuantity = isCurUserClickedDislikeBefore ? dislikesQtyBefore - 1 : dislikesQtyBefore + 1;
            likedUsers = isCurUserClickedLikeBefore
                ? likedUsersBefore.filter(userBefore => userBefore !== currentUserName)
                : likedUsersBefore;
            dislikedUsers = isCurUserClickedDislikeBefore
                ? dislikedUsersBefore.filter(userBefore => userBefore !== currentUserName)
                : [...dislikedUsersBefore, currentUserName];
        }

        return { likesQuantity, dislikeQuantity, likedUsers, dislikedUsers };
    }

    const getUpdatedThumbData = (thumbData, isLike) => {
        const { likesQuantity, dislikeQuantity, likedUsers, dislikedUsers } = getNewThumbData(thumbData, isLike);

        return {
            ...thumbData,
            [characterName]: {
                likes: {
                    quantity: likesQuantity,
                    likedUsers
                },
                dislikes: {
                    quantity: dislikeQuantity,
                    dislikedUsers
                }
            }
        };
    }

    const handleThumb = action => {
        const thumbData = getThumbData();
        const isFirstThumbForThisCharacter = !thumbData[characterName];
        const isLike = action === LIKE;

        const newThumbData = isFirstThumbForThisCharacter
            ? getFirstThumbClickData(thumbData, isLike)
            : getUpdatedThumbData(thumbData, isLike);

        const { likes, dislikes } = newThumbData[characterName];
        const likeQuantity= likes.quantity;

        setThumbData(newThumbData);
        setLikeQty(likeQuantity);
        setDislikeQty(dislikes.quantity);

        if (likeQuantity) {
            setLikedCharactersContext(prevState => [...prevState, characterName]);
        } else {
            setLikedCharactersContext(prevState => {
                return prevState.filter(prevName => prevName !== characterName);
            });
        }
    }

    useEffect(() => {
        const thumbData = getThumbData()[characterName];

        if (thumbData) {
            setLikeQty(thumbData.likes.quantity);
            setDislikeQty(thumbData.dislikes.quantity);
        }
    }, []);

    return (
        buttonsData.map(({ quantity, text, handler }) => (
            <Button
                key={text}
                onClick={handler}
                size="small"
            >
                {`${quantity} ${text}`}
            </Button>
        ))
    );
})