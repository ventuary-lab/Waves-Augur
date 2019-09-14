import React from 'react';
import Button from 'yii-steroids/ui/form/Button';
import { html } from 'components';

const bem = html.bem('TransactionSuccessView');

import './index.scss';

function TransactionSuccess (props) {
    const { onOk } = props;

    return (
        <>
            <div className={bem.element('root')}>

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