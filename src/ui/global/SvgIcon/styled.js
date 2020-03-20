import styled from 'styled-components';

export const StyledSvgIcon = styled.span`
    display: block;
    width: 30px;
    height: 30px;

    & svg {
        width: 100%;
        height: 100%;
        display: inline-block;
        vertical-align: middle;

        * {
            ${({ fillColor, strokeColor }) => `
                fill: ${fillColor ? fillColor : '' };
                stroke: ${strokeColor ? strokeColor : '' };
            `}
        }
    }
`;