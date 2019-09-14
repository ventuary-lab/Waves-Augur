import React from 'react';
import keeperApprovePic from 'static/icons/keeper-approve-pic.svg';
import stopSignIcon from 'static/icons/stop-sign.svg';
import Button from 'yii-steroids/ui/form/Button';

import { html } from 'components';
const bem = html.bem('KeeperApproveView');


function KeeperApprove (props) {
    const { onOk } = props;

    return (
        <>
            <div className={bem.element('transaction-failure-body')}>
            </div>
            <div>
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