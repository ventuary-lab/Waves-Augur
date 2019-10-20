
import React from 'react';
import BaseModal from 'ui/modal/BaseModal';
import { html } from 'components';
import Button from 'yii-steroids/ui/form/Button';
import SvgIcon from 'ui/global/SvgIcon';
const crossIcon = require('!svg-inline-loader?classPrefix!static/icons/cross-icon-artwork.svg');

import './index.scss';

const bem = html.bem('BaseWarning');

class BaseWarning extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            isVisible: true
        };
    }

    _getView () {
        const { children, heading, body } = this.props;

        return (
            <div className={bem.element('view')}>
                <h4>{heading}</h4>
                <p>{body}</p>
                {children}
                <SvgIcon icon={crossIcon}/>
            </div>
        );
    }

    render () {
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                <BaseModal isVisible={isVisible}>
                    {this._getView()}
                </BaseModal>
            </div>
        );
    }
}

export default BaseWarning;

