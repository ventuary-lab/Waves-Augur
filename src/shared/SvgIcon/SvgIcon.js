import React from 'react';

export default class SvgIcon extends React.PureComponent {
    render() {
        return (
            <img
                {...this.props}
                src={this.props.icon}
                alt=''
            />
        );
    }
}
