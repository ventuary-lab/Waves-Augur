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
        this._getPreviews = this._getPreviews.bind(this);
        this._mapPreview = this._mapPreview.bind(this);

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

    _mapPreview (item) {
        return (
            <div>
                <img src={item}/>
            </div>
        );
    }

    _getPreviews () {
        const { previews } = this.props;

        if (!previews || !Array.isArray(previews)) {
            return null;
        }

        return (
            <div className={bem.element('previews-cont')}>
                {previews.slice(0, 6).map(this._mapPreview)}
            </div>
        )
    }

    render () {
        const { isOpened } = this.state;
        const { children, title, mobileTitle } = this.props;
        const { _triggerDropdown, _adjustTitle } = this;

        const className = [
            bem.element('root'),
            isOpened ? 'opened' : ''
        ].join(' ');


        const computedTitle = mobileTitle ? mobileTitle : _adjustTitle(title);

        return (
            <div className={className}>
                <div className={bem.element('item')} onClick={_triggerDropdown}>
                    {!isOpened && this._getPreviews()}
                    <span>{computedTitle}</span>
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

