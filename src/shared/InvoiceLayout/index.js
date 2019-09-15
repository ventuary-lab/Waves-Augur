import React from 'react';
import _ from 'lodash';
import Button from 'yii-steroids/ui/form/Button';
import { html, dal } from 'components';

const bem = html.bem('InvoiceLayout');

import './index.scss';

class InvoiceLayout extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    async componentDidMount () {
        const address = _.get(this.props, 'match.params.address');
        if (!address) {
            return;
        }

        const user = await dal.getUser(address);

        this.setState({ user });
    }

    render () {
        const { user } = this.state;
        const { params } = this.props.match;
        if (!user || !params) {
            return <div></div>;
        };

        return (
            <div className={bem.element('root')}>
                <div className={bem.element('info')}>
                    <span>Please transfer funds</span>
                    <span>to the following user via Waves Keeper</span>
                </div>
                <div className={bem.element('box')}>
                    <div className={bem.element('flex-box')}>
                        <div>
                            <span>Transfer recipient</span>
                            <div>
                                <img src={user.profile.avatar}/>
                                <div>
                                    <span>{user.profile.name}</span>
                                    <span>{user.profile.title}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span>Transfer amount:</span>
                            <div>
                                <span>{params.amount}</span>
                                <span>{params.currency}</span>
                            </div>
                        </div>
                    </div>
                    <div className={bem.element('transfer-btn')}>
                        <Button
                            color='primary'
                            label='Transfer'
                        />
                    </div>
                </div>
                <div className={bem.element('new-ideas-btn')}>
                    <Button
                        outline
                        color='primary'
                        label='Explore new ideas'
                        onClick={() => {}}
                    />
                </div>
            </div>
        )
    }
}

export default InvoiceLayout;