import React from 'react';

export default class SvgIcon extends React.PureComponent {
    render() {
        return (
            <span
                dangerouslySetInnerHTML={{__html: this.props.icon}}
                {...this.props}
            />
        );
    }
}
