import React from 'react';
import Button from 'yii-steroids/ui/form/Button';
import { html } from 'components';
import AlertBadge from 'shared/AlertBadge';

const bem = html.bem('TransactionSuccessView');

import './index.scss';

function TransactionSuccess (props) {
    const { onOk, user, amount } = props;
    const { profile } = user;

    return (
        <>
            <div className={bem.element('root')}>
                <div>
                    <AlertBadge text='Transferring was successful!'/>
                    <div className={bem.element('box')}>
                        <div className={bem.element('recipient')}>
                            <span>Transfer recipient:</span>
                            <div>
                                <img src={profile.avatar}/>
                                <div>
                                    <span>{profile.name}</span>
                                    <span>{profile.title}</span>
                                </div>
                            </div>
                        </div>
                        <div className={bem.element('amount')}>
                            <span>Transfer amount:</span>
                            <div>
                                <span>{amount}</span>
                                <span>WAVES</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={bem.element('btn')}>
                <Button
                    type='submit'
                    color='primary'
                    label='Ok'
                    onClick={onOk}
                />
            </div>
        </>
    )
}

export default TransactionSuccess;