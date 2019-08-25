import React from 'react';
import loader from './index.gif';

const Loader = React.memo(
    () => {
        const style = {
            backgroundImage: loader
        };
    
        return (
            <div style={style}></div>
        );
    }
);

export {
    Loader
};