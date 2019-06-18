import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import ProfileSidebar from 'shared/ProfileLayout/views/ProfileSidebar';
import data from 'static/data/profile-sidebar';

import './TestPage.scss';

const bem = html.bem('TestPage');

export default class TestPage extends React.PureComponent {

    static propTypes = {

    };

    render() {

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <ProfileSidebar
                                {...data.user}
                            />
                        </div>
                        <div className='col col_tablet-count-8'>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aperiam dicta eius nam omnis quasi quia repellendus rerum tenetur, velit? Alias delectus deleniti dolore harum ipsam porro quasi quo velit.
                        </div>
                    </div>
                </div>
                <div className={bem.element('image-line')}/>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <ProfileSidebar
                                {...data.project}
                                isProject={true}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
