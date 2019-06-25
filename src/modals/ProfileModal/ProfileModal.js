import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Modal from 'yii-steroids/ui/modal/Modal';

import {html, dal} from 'components';
import AboutTab from './views/AboutTab';
import LinksTab from './views/LinksTab';
import WaitingTab from './views/WaitingTab';
import FormWizard from 'ui/form/FormWizard';

const bem = html.bem('ProfileModal');

import './ProfileModal.scss';
import {getUser} from 'yii-steroids/reducers/auth';

@connect(
    state => ({
        user: getUser(state),
    })
)
export default class ProfileModal extends React.Component {

    static propTypes = {
        user: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this._onSubmit = this._onSubmit.bind(this);
    }

    render() {
        return (
            <Modal
                {...this.props}
                className={bem.block()}
            >
                <FormWizard
                    formId='ProfileModal'
                    onSubmit={this._onSubmit}
                    initialValues={{
                        name: this.props.user ? this.props.user.name : null,
                    }}
                    items={[
                        {
                            id: 'waiting',
                            component: WaitingTab,
                        },
                        {
                            id: 'links',
                            component: LinksTab,
                        },
                        {
                            id: 'about',
                            component: AboutTab,
                        },
                    ]}
                />
            </Modal>
        );
    }

    _onSubmit(values) {
        (async () => {
            try {
                const res = await dal.saveUser(values);
                console.log(res);
                //window.alert(JSON.stringify({signResponse}));
            } catch (e) {
                console.error(e);
            }

            this.props.onClose();
        })();
    }
}
