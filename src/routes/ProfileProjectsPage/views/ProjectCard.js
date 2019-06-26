import React from 'react';
import PropTypes from 'prop-types';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardProgress from 'shared/Card/views/CardProgress';

import {html} from 'components';

import './ProjectCard.scss';

const bem = html.bem('ProjectCard');

export default class ProjectCard extends React.PureComponent {

    static propTypes = {
        logoUrl: PropTypes.string,
        coverUrl: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
        targetWaves: PropTypes.number,
        country: PropTypes.string,

        //todo
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: CardInfo,
                        componentProps: {
                            ...this.props,
                            isProject: true,
                        }
                    }}
                    right={{
                        component: CardProgress,
                        componentProps: {
                            ...this.props,
                        }
                    }}
                />
            </div>
        );
    }
}
