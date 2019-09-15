import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Button from 'yii-steroids/ui/form/Button';
import { html, dal, store } from 'components';
import { push } from 'react-router-redux';
import AlertBadge from 'shared/AlertBadge';
import BaseTransferModal from 'modals/BaseTransferModal';

const bem = html.bem('InvoiceLayout');

import './index.scss';

class InvoiceLayout extends React.PureComponent {
    constructor(props) {
        super(props);

        this._handleTransfer = this._handleTransfer.bind(this);

        this.modalProps = {
            heading: 'Transferring funds to a user',
            initialViewIndex: 2,
            approveButton: {
                label: 'Transfer'
            }
        };

        this.state = {
            user: null,
            transactionApproved: false,
            isModalOpened: false
        };
    }

    async _handleTransfer () {
        const { address, amount } = _.get(this.props, 'match.params');

        try {
            await dal.transferFunds(address, amount);
            this.setState({ transactionApproved: true, isModalOpened: false });
        } catch (err) {
            this.setState({ isModalOpened: true });
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
        const { user, transactionApproved, isModalOpened } = this.state;
        const { params } = this.props.match;
        if (!user || !params) {
            return <div></div>;
        };

        return (
            <div className={bem.element('root')}>
                {isModalOpened && ReactDOM.createPortal(
                    <BaseTransferModal
                        user={user}
                        onClose={() => this.setState({ isModalOpened: false })} 
                        isOpened={isModalOpened}
                        isInvoice={this.props.isMe}
                        modalProps={this.modalProps}
                    />,
                    document.body
                )}
                <div className={bem.element('info')}>
                    <span>Please transfer funds</span>
                    <span>to the following user via Waves Keeper</span>
                </div>
                <div className={bem.element('box', { approved: transactionApproved })}>
                    {transactionApproved && <AlertBadge text='Transferring was successful'/>}
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
                    {!transactionApproved && (
                        <div className={bem.element('transfer-btn')}>
                            <Button
                                color='primary'
                                label='Transfer'
                                onClick={this._handleTransfer}
                            />
                        </div>
                    )}
                </div>
                <div className={bem.element('new-ideas-btn')}>
                    <Button
                        outline
                        color='primary'
                        label='Explore new ideas'
                        onClick={() => store.dispatch(push('/projects/featured'))}
                    />
                </div>
            </div>
        )
    }
}

export default InvoiceLayout;