import React from 'react';
import Button from 'yii-steroids/ui/form/Button';
import { html } from 'components';

const bem = html.bem('TransactionSuccessView');

function TransactionSuccess () {
    return (
        <>
            <div className={bem.element('root')}>

            </div>
            <div>
                <Button
                    type='submit'
                    color='primary'
                    label='Ok'
                    onClick={() => this.setState({ viewIndex: 2 })}
                />
            </div>
        </>
    )
}

export default TransactionSuccess;