import React from 'react';
import { html } from 'components';
import CustomHint from 'shared/CustomHint';
import './AddEntityIcon.scss';

const dottedAddIcon = require('!svg-inline-loader?classPrefix!static/icons/dotted-add-icon.svg');

const bem = html.bem('AddEntityIcon');

class AddEntityIcon extends React.PureComponent {
    constructor(props) {
        super(props);

        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this.onHover = props.onHover ? props.onHover : () => {};

        this.state = {
            isHovered: false
        };
    }

    _onMouseLeave () {
        this.setState({ isHovered: false });
        this.onHover(null);
    }

    _onMouseEnter () {
        this.setState({ isHovered: true });
        this.onHover(this.props.itemIndex);
    }

    render() {
        const { item, adaptive, isActive } = this.props;
        const { isHovered } = this.state;
        const { placeholder } = item;

        return (
            <div 
                className={bem.element('root', { active: isActive })}
                onMouseLeave={this._onMouseLeave}
                onMouseEnter={this._onMouseEnter}>
                <CustomHint
                    isHovered={isHovered}
                    adaptive={adaptive}
                    text={placeholder}
                    icon={dottedAddIcon}
                />
            </div>
        );
    }
}

export default AddEntityIcon;