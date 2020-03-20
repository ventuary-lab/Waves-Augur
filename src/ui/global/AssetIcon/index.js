import React from 'react';
import SvgIcon from '../SvgIcon';
// import usdnIcon from 'static/icons/usd-n.svg';
const usdnIcon = require('!svg-inline-loader?classPrefix!static/icons/usd-n.svg');

function AssetIcon () {
    return <SvgIcon icon={usdnIcon} />;
}

export default AssetIcon;