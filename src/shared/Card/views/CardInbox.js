import React from 'react';
import PropTypes from 'prop-types';
import InboxTypeEnum from 'enums/InboxTypeEnum';
import Link from 'yii-steroids/ui/nav/Link';

import {html} from 'components';

import './CardInbox.scss';
import {ROUTE_PROJECT_DETAILS} from 'routes';

const bem = html.bem('CardInbox');

export default class CardInbox extends React.PureComponent {

    static propTypes = {
        type: PropTypes.oneOf(InboxTypeEnum.getKeys()),
        uid: PropTypes.string,
        address: PropTypes.string,
        isProject: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block()}>

                <div className={bem.element('info')}>
                    <Link
                        className={bem.element('icon')}
                        toRoute={
                            this.props.isProject
                                ? ROUTE_PROJECT_DETAILS
                                : null
                        }
                        toRouteParams={{
                            uid: this.props.isProject && this.props.uid,
                            address: !this.props.isProject && this.props.address
                        }}
                        noStyles
                    >
                        <span className={`Icon ${InboxTypeEnum.getCssClass(this.props.type)}`}/>
                    </Link>
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
