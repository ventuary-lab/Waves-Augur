import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

class BaseModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render () {
        const { children } = this.props;

        return (
            ReactDOM.createPortal(
                <div className='BaseModal-root'>
                    <div>
                        {children}
                    </div>
                </div>,
                document.body
            )
        );
    }
}

export default BaseModal;