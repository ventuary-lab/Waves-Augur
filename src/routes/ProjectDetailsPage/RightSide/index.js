import React from 'react';
import { html, store } from 'components';


import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';
import TextField from 'yii-steroids/ui/form/TextField';
import Modal from 'yii-steroids/ui/modal/Modal';
import CopyToClipboard from 'shared/CopyToClipboard';
import SocialLinks from 'shared/SocialLinks';
import { openModal } from 'yii-steroids/actions/modal';

import rocketIcon from 'static/icons/rocket-icon-flying.svg';

import './index.scss';

function RewardCell ({ onClick = () => {}, ...restProps }) {
    const bem = html.bem('ProjectRewardCell');

    return (
        <div className={bem.element('root')} {...restProps}>
            <div>
                <span>Our sincerest thank you!</span>
                <span>Pledge 3 WAVES or more</span>
                <span>Thank you, even the smallest support counts! We will keep you posted on our next steps</span>
                <button onClick={onClick}>Join 3 WAVES tier</button>
            </div>
        </div>
    );
}

const FORM_ID = 'JoinWavesModalForm';

function JoinWavesModal (props) {
    const { onClose } = props;
    const bem = html.bem('JoinWavesModal');
    const formTitle = 'Join 3 WAVES tier';

    const onSubmit = (vals) => {
        console.log({ vals });
    }

    return (
        <Modal {...props.modalProps}>
            <Form
                className={bem.element('root')}
                formId={FORM_ID}
                title={__(formTitle)}
                onSubmit={onSubmit}
                onComplete={() => onClose()}>
                <span>{formTitle}</span>
                <TextField
                    attribute='rewardWaves'
                    placeholder={__('Leave a comment') }
                />
                <Button
                    type='submit'
                    label={__('Contribute')}
                    color='primary'
                />
            </Form>
        </Modal>
    )
}

function RightSide ({ parentName, socials }) {
    const bemRef = React.useRef(html.bem(`${parentName}RightSide`));
    const { current: bem } = bemRef;
 
    const rewardsExist = true;

    const rewardCellProps = {
        onClick: () => {
            store.dispatch(openModal(JoinWavesModal));
        }
    }

    const rootClassName = [
        'col col_desk-reverse col_desk-count-5',
        bem.element('root')
    ].join(' ');

    return (
        <div className={rootClassName}>
            <div className={bem.element('links')}>
                <div className={bem.element('social-links')}>
                    <SocialLinks
                        urls={socials}
                    />
                </div>
                <CopyToClipboard copyText={document.location.toString()}>
                    <button className={bem.element('share-link')}>{__('Share Project')}</button>
                </CopyToClipboard>
            </div>
            <div>
                <div>
                    <img src={rocketIcon}/>
                    <span>Your Reward</span>
                </div>
                {Array(10).fill(<RewardCell {...rewardCellProps}/>)}
                <div className={bem.element('additional-info')}>
                    <span>+ Ventuary DAO reward</span>
                    <span>
                        In case of a successful grant approval, you
                        will receive your donation times 1.5 as a reward from Ventuary DAO. 
                    </span>
                </div>
            </div>
        </div>
    )
}


export default React.memo(RightSide);