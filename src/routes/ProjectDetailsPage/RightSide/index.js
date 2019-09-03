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
import {
    unHashGeneratedKey
} from 'ui/global/helper';
import {
    DONATE_AMOUNT_COLLECTION
} from 'ui/global/constants';

import './index.scss';

function RewardCell ({ onClick = () => {}, reward, ...restProps }) {
    const bem = html.bem('ProjectRewardCell');
    const { amount, title, desc } = reward;

    return (
        <div className={bem.element('root')} {...restProps}>
            <div>
                <span>{title}</span>
                <span>Pledge {amount} WAVES or more</span>
                <span>{desc}</span>
                <button onClick={onClick}>Join {amount} WAVES tier</button>
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

function RightSide ({ parentName, socials, project }) {
    const bemRef = React.useRef(html.bem(`${parentName}RightSide`));
    const { current: bem } = bemRef;
    const { rewards } = project;

    const rewardCellProps = {
        onClick: () => {
            store.dispatch(openModal(JoinWavesModal));
        }
    }

    const rootClassName = [
        'col col_desk-reverse col_desk-count-5',
        bem.element('root')
    ].join(' ');

    const mappedRewards = rewards && Object.keys(rewards)
        .filter(rewardKey => rewards[rewardKey].isChecked)
        .map(rewardKey => (
            <RewardCell
                {...rewardCellProps} 
                reward={{ ...rewards[rewardKey], amount: DONATE_AMOUNT_COLLECTION[unHashGeneratedKey(rewardKey)] }}
            />
        )) || [];

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
                {mappedRewards}
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