import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {html} from 'components';
import ProfileSidebar from 'shared/ProfileSidebar';
import {getNavItems} from 'reducers/navigation';
import data from 'static/data/profile-sidebar';
import RoutesEnum from 'enums/RoutesEnum';
import ProfileContentFilter from './views/ProfileContentFilter';

import './ProfilePage.scss';

const bem = html.bem('ProfilePage');

@connect(
    (state) => ({
        profileFilterNavItems: getNavItems(state, RoutesEnum.PROFILE),
    })
)
export default class ProfilePage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <div className={bem.element('sidebar')}>
                                <ProfileSidebar
                                    {...data.user}
                                />
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('content')}>
                                {/*<ProfileContentFilter
                                    navItems={this.props.profileFilterNavItems}
                                >
                                    <div>
                                        123
                                    </div>
                                </ProfileContentFilter>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
