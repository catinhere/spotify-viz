import React from 'react';
import SpotifyPlaceholder from '../assets/spotify-icon.png';
import ToggleBtn from './ToggleBtn';

function CurrentArtist(props) {
    return (
        <div className="result">
            <div><img className="artist-img" alt="current artist img" src={props.artist.images.length === 0 ? SpotifyPlaceholder : props.artist.images[0].url}></img></div>
            <div>
                <div className="artist-name">{props.artist.name}</div>
                <div>
                    <ToggleBtn handleToggle={props.handleToggle}/>
                    <div className="label">Play music on hover</div>
                </div>
            </div>
            <div id="generate-container"><button onClick={() => props.handleGenerate()} className="btn-lg" type="submit">Generate</button></div>
        </div>
    );
}

export default CurrentArtist;