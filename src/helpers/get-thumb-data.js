export const getThumbData = () => {
    const likedCharacters = localStorage.getItem('thumbData');

    return likedCharacters ? JSON.parse(likedCharacters) : {};
}