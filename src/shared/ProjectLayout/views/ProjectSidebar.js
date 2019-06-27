import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';

// import {getUser} from 'yii-steroids/reducers/auth';
import {html} from 'components';
import Tags from 'shared/Tags';
import ProjectProgress from 'shared/ProjectProgress';
import projectAvatarStub from 'static/images/project-avatar-stub.png';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectSidebar.scss';

const bem = html.bem('ProjectSidebar');

@connect(
    state => ({
        project: {
            title: 'SmartChain Media',
            description: 'Build Blockchain-related applications and uild applications ser',
            logoUrl: null,
            coverUrl: null,
            expireVoting: '2019-07-01',
            expireCrowd: '2019-08-01',
            expireWhale: '2019-08-05',
            targetWaves: 1000,
            tags: ['RDN', 'Analytics'],
            country: 'RU',
            contents: {
                problem: '',
                solution: '',
                xFactor: '',
                mvp: '',
                largeScaleAdoption: '',
                impactOnUser: '',
                impactOnUserContext: '',
                impactOnUserSociety: '',
                codeValidation: '',
                legalArrangements: '',
                openSourceStrategy: '',
                interconnectedness: '',
            },
            socials: {
                url_twitter: null,
                url_facebook: null,
                url_linkedin: null,
                url_instagram: null,
                url_telegram: null,
                url_website: null,
            },

            currentWaves: 43,
            againstWaves: 5,

        },
    })
)
export default class ProjectSidebar extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        const status = ProjectStatusEnum.getStatus(this.props.project);

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.project.logoUrl || projectAvatarStub}
                    alt={this.props.project.title}
                />
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.project.title}
                    </span>
                    <span className={bem.element('description')}>
                        {this.props.project.description}
                    </span>

                    <ProjectProgress
                        targetWaves={this.props.project.targetWaves}
                        currentWaves={this.props.project.currentWaves}
                        againstWaves={this.props.project.againstWaves}
                    />
                    <div className={bem.element('info-string', 'activity')}>
                        <span>{__('Status')}:</span>
                        <span className={bem.element('info-value')}>
                            {ProjectStatusEnum.getLabel(status)}
                        </span>
                    </div>

                    {this.props.project.country && (
                        <div className={bem.element('country')}>
                            <span className={'MaterialIcon'}>location_on</span>
                            &nbsp;
                            <span>{this.props.project.country}</span>
                        </div>
                    )}
                    {this.props.project.tags && this.props.project.tags.length > 0 && (
                        <Tags
                            items={this.props.project.tags}
                        />
                    )}
                    <table className={bem.element('crowdfunding')}>
                        <tr>
                            <td>{__('Crowdfunding')}</td>
                            <td>
                                {moment(this.props.project.expireVoting).format('DD.MM.YYYY')}
                            </td>
                        </tr>
                        <tr>
                            <td>{__('Finish')}</td>
                            <td>{moment(this.props.project.expireCrowd).format('DD.MM.YYYY')}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}
