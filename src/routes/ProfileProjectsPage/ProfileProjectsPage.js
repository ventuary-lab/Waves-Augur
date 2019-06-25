import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {openModal} from 'yii-steroids/actions/modal';

import ProfileLayout from 'shared/ProfileLayout';
import ActionButtonBlock from 'shared/ActionButtonBlock';
import ProjectCard from './views/ProjectCard';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import {html} from 'components';

import './ProfileProjectsPage.scss';
import AddNewProjectModal from 'modals/AddNewProjectModal';

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
                            status={ProjectStatusEnum.VOTING}
                            country={'Russia'} //TODO: need enum
                            activity={1422}
                        />
                    </div>
                </ProfileLayout>
            </div>
        );
    }

    onProjectAdd() {
        this.props.dispatch(openModal(AddNewProjectModal));
    }
}
