import React from 'react';
import PropTypes from 'prop-types';
import {CopyToClipboard as CopyToBuffer} from 'react-copy-to-clipboard';

import {html} from 'components';

import './CopyToClipboard.scss';

const bem = html.bem('CopyToClipboard');

export default class CopyToClipboard extends React.PureComponent {

    static propTypes = {
        copyText: PropTypes.string,
        children: PropTypes.any,
    };

    constructor() {
        super(...arguments);

        this.state = {
            isCopied: false,
        };
    }

    render() {
        return (
            <div className={bem.block()}>
                <CopyToBuffer
                    text={this.props.copyText}
                    onCopy={
                        () => this.setState(
                            {isCopied: true},
                            () => setTimeout(
                                () => this.setState({isCopied: false}), 2000
                            )
                        )
                    }
                >
                    <span>{this.props.children || __('Copy to clipboard')}</span>
                </CopyToBuffer>
                {this.state.isCopied && (
                    <div className={bem.element('message')}>
                        {__('Link copied to clipboard')}
                    </div>
                )}
            </div>
        );
    }
}
