import React, {useState} from 'react';

const Header = (props) => {
    const {clicked} = props;

    return (
        <div className="top-menu">
            <a className="menu-link" href="/">Back to Start</a>
        </div>
    );
};

export default Header;
