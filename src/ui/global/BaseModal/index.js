import React from 'react';
// import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import './index.scss';

class BaseModal extends React.Component {
    // static propTypes = {
        
    // }

    constructor(props) {
        super(props);

    }

    render () {
        const { children, renderNode: _renderNode } = this.props;
        const renderNode = _renderNode || document.body;

        return (
            ReactDOM.createPortal(
                <div className='BaseModal-root'>
                    <div>
                        {children}
                    </div>
                </div>,
                renderNode
            )
        );
    }
}

export default BaseModal;