import React from 'react';
import keeperApprovePic from 'static/icons/keeper-approve-pic.svg';
import stopSignIcon from 'static/icons/stop-sign.svg';
import Button from 'yii-steroids/ui/form/Button';

import { html } from 'components';
const bem = html.bem('KeeperApproveView');

import './index.scss';

function KeeperApprove (props) {
    const { onOk } = props;

    return (
        <>
            <div className={bem.element('root')}>
                <div>
                    <div>
                        <img src={stopSignIcon}/>
                        <span>Your transaction was not approved.</span>
                    </div>
                    <div>
                        <span>Please click “Approve” in your Waves Keeper</span>
                        <span>browser extension for fund transfer confirmation</span>
                    </div>
                </div>
                <div>
                    <img src={keeperApprovePic}/>
                </div>
            </div>
            <div className={bem.element('btn')}>
                <Button
                    type='submit'
                    color='primary'
                    label='Ok, I understand'
                    onClick={onOk}
                />
            </div>
        </>
    )
}

export default KeeperApprove;