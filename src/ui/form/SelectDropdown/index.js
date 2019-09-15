import React from 'react';
import checkedIcon from 'static/icons/checked-icon.svg';
import dropdownArrow from 'static/icons/dropdown-arrow-tiny.svg';
import OutsideAlerter from 'ui/global/OutsideAlerter';
import PropTypes from 'prop-types';

import './index.scss';

class SelectDropdown extends React.Component {
    static propTypes = {
        initialIndex: PropTypes.number,
        options: PropTypes.array
    }

    constructor(props) {
        super(props);

        this._mapOption = this._mapOption.bind(this);
        this._getClassName = this._getClassName.bind(this);
        this._selectOption = this._selectOption.bind(this);
        this._triggerDropdown = this._triggerDropdown.bind(this);
        this._computeOptionProps = this._computeOptionProps.bind(this);

        this.state = {
            isOpened: false,
            currentIndex: 0
        };
    }

    _triggerDropdown (isOpened) {
        this.setState({ isOpened });
    }

    _selectOption (optIndex) {
        this.setState({ currentIndex: optIndex });
    }

    _computeOptionProps (optIndex) {
        return {
            className: optIndex === this.state.currentIndex ? 'checked option-with-icon' : '',
            onClick: () => this._selectOption(optIndex)
        };
    }

    _mapOption (opt, optIndex) {
        const { _computeOptionProps } = this;
        const optionProps = _computeOptionProps(optIndex);
        const isChecked = optIndex === this.state.currentIndex;

        return (
            <div {...optionProps}>
                <span>{opt}</span>
                {isChecked && <img src={checkedIcon}/>}
            </div>
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
            <OutsideAlerter onOutsideClick={() => _triggerDropdown(false)}>
                <div className={_getClassName()}>
                    <div onClick={() => _triggerDropdown(!isOpened)} className='option-with-icon'>
                        <span>{_options[currentIndex]}</span>
                        <img src={dropdownArrow}/>
                    </div>
                    <div className='dropdown-options'>
                        {options}
                    </div>
                </div>
            </OutsideAlerter>
        );
    }
}

export default SelectDropdown;
