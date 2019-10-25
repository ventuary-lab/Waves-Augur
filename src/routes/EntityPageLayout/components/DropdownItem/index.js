import React from 'react';
import { html } from 'components';
import dropdownIcon from 'static/icons/campaign/dropdown-arrow.svg';
// const dropdownIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/dropdown-arrow.svg');

import './index.scss';

const bem = html.bem('DropdownItem');

const DEFAULT_TYPE = 'default';
const TEAM_MEMBERS_TYPE = 'teamMembers';
const PAGES_TYPE = 'pages';

class DropdownItem extends React.Component {
    constructor (props) {
        super(props);

        this._triggerDropdown = this._triggerDropdown.bind(this);

        this.state = {
            isOpened: false
        };
    }

    _triggerDropdown () {
        this.setState(prevState => ({ isOpened: !prevState.isOpened }));
    }

    _adjustTitle (title) {
        return title[0].toUpperCase() + title.slice(1).toLowerCase();
    }

    render () {
        const { isOpened } = this.state;
        const { children, title } = this.props;
        const { _triggerDropdown, _adjustTitle } = this;

        const className = [
            bem.element('root'),
            isOpened ? 'opened' : ''
        ].join(' ');

        return (
            <div className={className}>
                <div className={bem.element('item')} onClick={_triggerDropdown}>
                    <span>{_adjustTitle(title)}</span>
                    <img src={dropdownIcon} />
                </div>
                {isOpened && (
                    <div className={bem.element('body')}>
                        {children}
                    </div>
                )}
            </div>
        );
    }
}

export default DropdownItem;

