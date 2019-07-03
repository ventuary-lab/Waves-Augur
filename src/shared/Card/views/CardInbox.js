import React from 'react';
import PropTypes from 'prop-types';
import InboxTypeEnum from 'enums/InboxTypeEnum';

import {html} from 'components';

import './CardInbox.scss';

const bem = html.bem('CardInbox');

export default class CardInbox extends React.PureComponent {

    static propTypes = {
        type: PropTypes.oneOf(InboxTypeEnum.getKeys())
    };

    render() {
        return (
            <div className={bem.block()}>

                <div className={bem.element('info')}>
                    <div className={bem.element('icon')}>
                        <span className={`Icon ${InboxTypeEnum.getCssClass(this.props.type)}`}/>
                    </div>
                    <div className={bem.element('title', {
                        gray: this.props.type === InboxTypeEnum.PROPOSAL_REJECTED || this.props.type === InboxTypeEnum.YOUR_PROPOSAL_REJECTED,
                    })}>
                        {InboxTypeEnum.getLabel(this.props.type)}
                    </div>
                </div>
                <div className={bem.element('actions')}>
                    <span className={bem.element('link')}>
                        {__('Read More')}
                    </span>
                </div>
            </div>
        );
    }
}
