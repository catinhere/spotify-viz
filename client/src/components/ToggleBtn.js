import React from 'react';

function ToggleBtn(props) {
    return (
        <div id="toggle-btn">
            <input onClick={() => props.handleToggle()} type="checkbox" id="switch" /><label htmlFor="switch">Toggle</label>
        </div>
    )
}

export default ToggleBtn;