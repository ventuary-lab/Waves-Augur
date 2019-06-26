import React from 'react';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import ActionButtonBlock from 'shared/ActionButtonBlock';
import ProjectCard from './views/ProjectCard';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import {html} from 'components';

import './ProfileProjectsPage.scss';
import ProjectWizardModal from 'modals/ProjectWizardModal';

const bem = html.bem('ProfileProjectsPage');

@connect()
export default class ProfileProjectsPage extends React.PureComponent {

    render() {
        return (
            <div className={bem.block()}>
                <ActionButtonBlock
                    title={__('Add New Project')}
                    iconClass='Icon__new-project'
                    onClick={() => this.props.dispatch(openModal(ProjectWizardModal))}
                />
                <div className={bem.element('card-list')}>

                    <ProjectCard
                        title={'SmartChain Media'}
                        description={'Build Blockchain-related applications and uild applications ser'}
                        logoUrl={''}
                        coverUrl={''}
                        expireVoting={'2019-07-01'}
                        expireCrowd={'2019-08-01'}
                        expireWhale={'2019-08-05'}
                        targetWaves={1000}
                        currentWaves={43}
                        againstWaves={5}
                        country={'Russia'} //TODO: need enum
                        activity={1422}
                    />
                </div>
            </div>
        );
    }

}
