import React from 'react';
import { StyledSvgIcon } from './styled';

function SvgIcon ({ icon, children, fillColor, strokeColor, ...restProps }) {

    return (
        <StyledSvgIcon
            {...restProps}
            fillColor={fillColor}
            strokeColor={strokeColor}
            dangerouslySetInnerHTML={{ __html: icon }}>
            {children}
        </StyledSvgIcon>
    )
}

export default SvgIcon;