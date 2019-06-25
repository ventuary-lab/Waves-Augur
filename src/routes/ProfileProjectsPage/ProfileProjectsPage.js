import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {openModal} from 'yii-steroids/actions/modal';

import ProfileLayout from 'shared/ProfileLayout';
import ActionButtonBlock from 'shared/ActionButtonBlock';

import {html} from 'components';

import './ProfileProjectsPage.scss';
import ProjectWizardModal from 'modals/ProjectWizardModal';

const bem = html.bem('ProfileProjectsPage');

@connect()
export default class ProfileProjectsPage extends React.PureComponent {

    static propTypes = {

    };

    constructor() {
        super(...arguments);

        this.onProjectAdd = this.onProjectAdd.bind(this);
    }

    render() {
        return (
            <div className={bem.block()}>
                <ProfileLayout>
                    <ActionButtonBlock
                        title={__('Add New Project')}
                        iconClass={'Icon__new-project'}
                        handleClick={this.onProjectAdd}
                    />
                </ProfileLayout>
            </div>
        );
    }

    onProjectAdd() {
        this.props.dispatch(openModal(ProjectWizardModal))
    }
}
