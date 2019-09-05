import React from 'react';
import { html, store, dal } from 'components';

import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';
import TextField from 'yii-steroids/ui/form/TextField';
import Modal from 'yii-steroids/ui/modal/Modal';
import CopyToClipboard from 'shared/CopyToClipboard';
import SocialLinks from 'shared/SocialLinks';
import { openModal } from 'yii-steroids/actions/modal';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import rocketIcon from 'static/icons/rocket-icon-flying.svg';
import {
    unHashGeneratedKey
} from 'ui/global/helper';
import {
    DONATE_AMOUNT_COLLECTION
} from 'ui/global/constants';

import './index.scss';

function RewardCell ({ onClick = () => {}, isAuthor, reward, project, ...restProps }) {
    const bem = html.bem('ProjectRewardCell');
    const { amount, title, desc } = reward;

    const donationAllowed = !isAuthor && (
        project.status === ProjectStatusEnum.VOTING ||
        project.status === ProjectStatusEnum.CROWDFUND
    );
    const _onClick = () => {
        if (donationAllowed) {
            onClick(amount);
        }
    };

    return (
        <div className={bem.element('root', donationAllowed ? 'not-author' : '')} {...restProps} onClick={_onClick}>
            <div>
                <span>{title}</span>
                <span>Pledge {amount} WAVES or more</span>
                <span>{desc}</span>
                {donationAllowed && <button>Join {amount} WAVES tier</button>}
            </div>
        </div>
    );
}

const FORM_ID = 'JoinWavesModalForm';

function JoinWavesModal (props) {
    const { onClose, amount, project } = props;
    const bem = html.bem('JoinWavesModal');
    const formTitle = `Join ${amount} WAVES tier`;

    const onSubmit = async ({ rewardWaves }) => {

        const payload = {
            comment: rewardWaves
        };

        try {
            await dal.donateProject(project.uid, amount, payload);
        } catch (err) {
            console.error(err);
        } finally {
            onClose();
        }
    };

    return (
        <Modal {...props.modalProps} className={bem.element('modal')}>
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

function RightSide ({ parentName, socials, project, isAuthor = false }) {
    const bemRef = React.useRef(html.bem(`${parentName}RightSide`));
    const { current: bem } = bemRef;
    const { rewards } = project;

    const rewardCellProps = {
        onClick: (amount) => {
            store.dispatch(openModal(JoinWavesModal, { project, amount }));
        },
        project,
        isAuthor
    };

    const rootClassName = [
        'col col_desk-reverse col_desk-count-5',
        bem.element('root')
    ].join(' ');

    const mappedRewards = rewards && Object.keys(rewards)
        .filter(rewardKey => {
            const { isChecked, title, desc } = rewards[rewardKey];
            return isChecked && !!title && !!desc;
        })
        .map(rewardKey => (
            <RewardCell
                {...rewardCellProps} 
                reward={{ ...rewards[rewardKey], amount: DONATE_AMOUNT_COLLECTION[unHashGeneratedKey(rewardKey)] }}
            />
        )) || [];

    const rewardsBlock = (
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
    );

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
            {mappedRewards.length > 0 && rewardsBlock}
        </div>
    )
}


export default React.memo(RightSide);