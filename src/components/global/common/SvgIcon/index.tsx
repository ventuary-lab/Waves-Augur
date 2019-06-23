import React from 'react';
import {
  StyledSvgIcon
} from './styled';

type SvgIconProps = {
  icon: string;
} & React.HTMLAttributes<HTMLSpanElement>;

const SvgIcon: React.FC<SvgIconProps> = ({ icon, ...restProps }) => (
  <StyledSvgIcon 
    dangerouslySetInnerHTML={{ __html: icon }} 
    {...restProps}
  />
)

export default SvgIcon;