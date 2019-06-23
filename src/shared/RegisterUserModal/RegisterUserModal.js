import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './RegisterUserModal.scss';

const bem = html.bem('RegisterUserModal');

export default class RegisterUserModal extends React.PureComponent {
    
    static propTypes = {
        
    };
    
    render() {
        return (
            <div className={bem.block()}>
                
            </div>
        );
    }
}