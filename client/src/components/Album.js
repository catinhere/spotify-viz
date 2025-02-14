import React from 'react';
import { colours } from '../constants';

function Album(props) {
    return (
        <div className="album">
            <div><span className="dot" style={{backgroundColor: colours[props.index]}}></span></div>
            <div>{props.album.name}</div>
        </div>
    )
}

export default Album;