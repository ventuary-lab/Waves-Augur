import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {html} from 'components';
import {getNavItems} from 'reducers/navigation';
import sidebarData from 'static/data/profile-sidebar';
import RoutesEnum from 'enums/RoutesEnum';
import ProfileSidebar from './views/ProfileSidebar';
import ProfileContentFilter from './views/ProfileContentFilter';

import './ProfileLayout.scss';

const bem = html.bem('ProfileLayout');

@connect(
    (state) => ({
        profileFilterNavItems: getNavItems(state, RoutesEnum.PROFILE),
    })
)
export default class ProfileLayout extends React.PureComponent {

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
                                    {...sidebarData.user}
                                />
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('content')}>
                                <ProfileContentFilter
                                    navItems={this.props.profileFilterNavItems}
                                >
                                    <div>
                                        {this.props.children}
                                    </div>
                                </ProfileContentFilter>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
