import React from 'react';

import {dal, html} from 'components';
import ContestSchema from 'types/ContestSchema';
import CopyToClipboard from 'shared/CopyToClipboard';
import SocialLinks from 'shared/SocialLinks';
import './ContestDetailsPage.scss';
import ContestContentEnum from 'enums/ContestContentEnum';
import ContestStatusEnum from 'enums/ContestStatusEnum';
import ProjectCard from 'shared/ProjectCard';
import ProjectSchema from '../../types/ProjectSchema';

const bem = html.bem('ContestDetailsPage');

export default class ContestDetailsPage extends React.PureComponent {

    static propTypes = {
        contest: ContestSchema,
        winner: ProjectSchema,
    };

    constructor() {
        super(...arguments);

        this.state = {
            winner: null,
        };
    }


    componentDidMount() {
        if (this.props.contest.status === ContestStatusEnum.COMPLETED) {
            dal.getProject(this.props.contest.winner)
                .then(winner => this.setState({winner}));
        }
    }

    render() {
        return (
            <div className={bem.block()}>
                {this.props.contest.winner && this.props.contest.status === ContestStatusEnum.COMPLETED && (
                    <div className={bem.element('leader-block')}>
                        <div className={bem.element('title')}>
                            {__('Winner')}
                        </div>
                        {this.state.winner && (
                            <ProjectCard item={this.state.winner}/>
                        ) || (
                            <span>
                                Loading...
                            </span>
                        )}
                    </div>
                )}
                <div className={bem.element('content')}>
                    <div className={'row'}>
                        <div className={'col col_desk-reverse col_desk-count-5'}>
                            <div className={bem.element('links')}>
                                <div className={bem.element('social-links')}>
                                    <SocialLinks
                                        urls={this.props.contest.socials}
                                    />
                                </div>
                                <CopyToClipboard copyText={document.location.toString()}>
                                    <button className={bem.element('share-link')}>{__('Share Contest')}</button>
                                </CopyToClipboard>
                                {this.renderRightInfo()}
                            </div>
                        </div>
                        <div className={'col col_desk-count-7'}>
                            <div className={bem.element('info')}>
                                {ContestContentEnum.getKeys()
                                    .filter(attribute => !!this.props.contest.contents[attribute])
                                    .map(attribute => (
                                        <div key={attribute}>
                                            <div className={bem.element('title')}>
                                                {ContestContentEnum.getLabel(attribute)}
                                            </div>
                                            <div className={bem.element('description')}>
                                                {this.props.contest.contents[attribute].split('\n').map((item, index) => (
                                                    <p key={index}>
                                                        {item}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderRightInfo() {
        return (
            <div className={bem.element('right-info')}>
                <div className={bem.element('right-info-item')}>
                    <div className={bem.element('title')}>
                        {__('Deliverables')}
                    </div>
                    <span className={bem.element('description')}>
                        {this.props.contest.contents.deliverables}
                    </span>
                </div>
                <div className={bem.element('right-info-item')}>
                    <div className={bem.element('title')}>
                        {__('Platform')}
                    </div>
                    <span className={bem.element('description')}>
                        {this.props.contest.contents.platform}
                    </span>
                </div>
                <div className={bem.element('right-info-item')}>
                    <div className={bem.element('title')}>
                        {__('Links / Files')}
                    </div>
                    <span className={bem.element('description')}>
                        {(this.props.contest.contents.links || '').split('\n').map((item, index) => (
                            <p key={index}>
                                {/^(http|https):\/\//.test(item) && (
                                    <a
                                        target={'_blank'}
                                        href={item}
                                    >
                                        {item}
                                    </a>
                                ) || (
                                    <span>{item}</span>
                                )}
                            </p>
                        ))}
                    </span>
                </div>
            </div>
        );

    }
}
