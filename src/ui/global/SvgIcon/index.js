import React from 'react';


function SvgIcon ({ icon, children, ...restProps }) {

    return (
        <span
            dangerouslySetInnerHTML={{ __html: icon }}
            {...restProps}>
            {children}
        </span>
    )
}

export default SvgIcon;