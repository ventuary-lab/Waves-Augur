import React from 'react';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import ActionButtonBlock from 'shared/ActionButtonBlock';

import {html} from 'components';

import './ProfileProjectsPage.scss';
import ProjectWizardModal from 'modals/ProjectWizardModal';

const bem = html.bem('ProfileProjectsPage');

@connect()
export default class ProfileProjectsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <ActionButtonBlock
                    title={__('Add New Project')}
                    iconClass={'Icon__new-project'}
                    onClick={() => this.props.dispatch(openModal(ProjectWizardModal))}
                />
            </div>
        );
    }
}
