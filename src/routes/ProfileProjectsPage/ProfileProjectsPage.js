import React from 'react';
import PropTypes from 'prop-types';

import ProfileLayout from 'shared/ProfileLayout';
import ActionButtonBlock from 'shared/ActionButtonBlock';

import {html} from 'components';

import './ProfileProjectsPage.scss';

const bem = html.bem('ProfileProjectsPage');

export default class ProfileProjectsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <ProfileLayout>
                    <ActionButtonBlock
                        title={__('Add New Project')}
                        iconClass={'Icon__new-project'}
                    />
                </ProfileLayout>
            </div>
        );
    }
}
