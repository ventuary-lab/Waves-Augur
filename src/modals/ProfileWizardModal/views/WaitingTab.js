import React from 'react';
import PropTypes from 'prop-types';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import SvgIcon from 'shared/SvgIcon';
import {profileSvg, arrowDown} from 'static/icons';


const bem = html.bem('WaitingTab');

import './WaitingTab.scss';
import UserSchema from 'types/UserSchema';
import Link from 'yii-steroids/ui/nav/Link';
import UserRole from 'enums/UserRole';
import {ROUTE_USER_DONATION, ROUTE_USER_GRANTS} from 'routes';


export default class WaitingTab extends React.PureComponent {

    static propTypes = {
        invitedBy: UserSchema,
        isCreate: PropTypes.bool,
    };

    render () {
        return (
            <div className={bem.block()}>
                {this.props.isCreate && (
                    <>
                        <div className={bem.element('title')}>
                            {__('We were waiting for you!')}
                        </div>
                        <span className={bem.element('invited-by')}>
                            {__('You were invited by')}&nbsp;
                            <Link
                                layoutClassName={bem.element('link')}
                                toRoute={this.props.invitedBy.role === UserRole.WHALE ? ROUTE_USER_GRANTS : ROUTE_USER_DONATION}
                                toRouteParams={{
                                    address: this.props.invitedBy.address,
                                }}
                                noStyles
                            >
                                {this.props.invitedBy.profile.name}
                            </Link>
                        </span>
                        <div className={bem.element('icon-invite')}>
                            <SvgIcon
                                icon={profileSvg}
                            />
                        </div>
                        <span className={bem.element('request')}>
                            {__('Please Register to Continue')}
                        </span>
                        <div className={bem.element('icon-arrow')}>
                            <SvgIcon icon={arrowDown}/>
                        </div>
                    </>
                ) || (
                    <div className={bem.element('title', 'is-edit')}>
                        {__('Edit profile')}
                    </div>
                )}

                <InputField
                    attribute='name'
                    topLabel={__('Your Nickname (Your Log In)')}
                    placeholder={__('Enter Your Name')}
                />
            </div>
        );
    }
}
