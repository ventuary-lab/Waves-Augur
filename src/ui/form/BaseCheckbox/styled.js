import styled from 'styled-components';

export const Input = styled.input`
    display: none;

    &:checked + span {
        ${({ img }) => `
            background: url("${img}");
        `}
        background-repeat: no-repeat;
        background-position: 3px 3px;
    }

    &:checked + span:after {
        content: '';
        position: absolute;
    }
    &:disabled + span:after {
        opacity: .5;
    }
`;