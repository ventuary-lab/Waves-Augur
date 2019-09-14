import React from 'react';
import checkedIcon from 'static/icons/checked-icon.svg';
import dropdownArrow from 'static/icons/dropdown-arrow-tiny.svg';

import './index.scss';

class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);

        this._mapOption = this._mapOption.bind(this);
        this._getClassName = this._getClassName.bind(this);
        this._triggerDropdown = this._triggerDropdown.bind(this);

        this.state = {
            isOpened: false,
            currentIndex: 0
        };
    }

    _triggerDropdown (isOpened) {
        this.setState({ isOpened });
    }

    _mapOption (opt) {
        return (
            <div>{opt}</div>
        );
    }

    _getClassName () {
        const res = [
            'SelectDropdown-root',
            !this.state.isOpened ? 'hidden' : ''
        ];

        return res.join(' ');
    }

    render () {
        const { _getClassName, _triggerDropdown } = this;
        const { options: _options = [] } = this.props;
        const { currentIndex, isOpened } = this.state;
        const options = _options.map(this._mapOption);

        return (
            <div className={_getClassName()}>
                <div onClick={() => _triggerDropdown(!isOpened)}>{options[currentIndex]}</div>
                <div>
                    {options}
                </div>
            </div>
        );
    }
}

export default SelectDropdown;
