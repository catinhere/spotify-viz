import React from 'react';
import SpotifyPlaceholder from '../assets/spotify-icon.png';

function Result(props) {
    return (
        <div className="result">
            <div><img className="artist-img" alt="result img" src={props.artist.images.length === 0 ? SpotifyPlaceholder : props.artist.images[0].url}></img></div>
            <div>
                <div className="artist-name">{props.artist.name}</div>
                <div>{props.artist.genres.length > 0 ? 'Genre: ' + props.artist.genres.join(", ") : null}</div>
                <div>{props.artist.followers.total ? 'Followers: ' + props.artist.followers.total : null}</div>
                <div><button className="select-btn" onClick={() => props.handleSelect(props.artist)}>Select</button></div>
            </div>
        </div>
    )
}

export default Result;