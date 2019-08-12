import React from 'react';
import {connect} from 'react-redux';
import Modal from 'yii-steroids/ui/modal/Modal';
import Button from 'yii-steroids/ui/form/Button';

import {dal, html} from 'components';
import ProjectWizard from 'modals/ProjectWizardModal/views/ProjectWizard';
import {isPhone} from 'yii-steroids/reducers/screen';

import './ParticipationContestModal.scss';
import Form from 'yii-steroids/ui/form/Form';
import InputField from 'yii-steroids/ui/form/InputField';
import ContestSchema from 'types/ContestSchema';
import validate from '../../shared/validate';
import _get from 'lodash/get';

const bem = html.bem('ParticipationContestModal');
const FORM_ID = 'ParticipationContestModal';

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ParticipationContestModal extends React.PureComponent {

    static propTypes = {
        contest: ContestSchema,
    };

    constructor() {
        super(...arguments);

        this.state = {
            isNewProject: null,
        };

        this._onSubmit = this._onSubmit.bind(this);
    }

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                {this.state.isNewProject === null && (
                    <>
                        <div className={bem.element('title')}>
                            {__('Participation in the Contest')}
                        </div>
                        <div className={bem.element('sub-title')}>
                            {__('If your project for the contest already exists on Ventuary-DAO  please paste the link below')}
                        </div>
                        <span className={bem(
                            bem.element('new-project-icon'),
                            'Icon Icon__new-project_lg')}
                        />
                        <Button
                            className={bem.element('action', 'already-have-project')}
                            color='primary'
                            onClick={() => this.setState({
                                isNewProject: false
                            })}
                        >
                            {__('I have a project for this contest already')}
                        </Button>

                        <Button
                            className={bem.element('action', 'create-new-project')}
                            color='primary'
                            link
                            onClick={() => this.setState({
                                isNewProject: true
                            })}
                        >
                            {__('Create new project for the contest right now')}
                        </Button>
                    </>
                )}

                {this.state.isNewProject === false && (
                    <>
                        <div className={bem.element('title')}>
                            {__('Participation in the Contest')}
                        </div>
                        <div className={bem.element('sub-title')}>
                            {__('Paste URL of your project on Ventuary-DAO  to participate in the Contest')}
                        </div>

                        <Form
                            formId={FORM_ID}
                            onSubmit={this._onSubmit}
                            onComplete={() => {
                                this.props.onClose();
                            }}
                        >
                            <div className={bem.element('project-link-field')}>
                                <InputField
                                    topLabel={__('Your Project’s URL on Ventuary DAO')}
                                    attribute={'projectLink'}
                                    placeholder={__('https://alpha.ventuary.space/projects/')}
                                />
                            </div>
                            <div className={bem.element('hint')}>
                                {__('Or if you have no suitable project')}
                            </div>
                            <Button
                                color='primary'
                                link
                                onClick={() => this.setState({
                                    isNewProject: true
                                })}
                            >
                                {__('Create new project for the contest right now')}
                            </Button>

                            <div className={bem.element('controls')}>
                                <div className={bem.element('control-back')}>
                                    <Button
                                        color='primary'
                                        link
                                        onClick={() => this.setState({
                                            isNewProject: null
                                        })}
                                    >
                                        {__('Back')}
                                    </Button>
                                </div>
                                <div className={bem.element('control-next')}>
                                    <Button
                                        type='submit'
                                        color='primary'
                                    >
                                        {__('Ok')}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </>
                )}

                {this.state.isNewProject === true && (
                    <ProjectWizard
                        onFirstBack={() => this.setState({
                            isNewProject: null,
                        })}
                        contest={this.props.contest}
                        onClose={this.props.onClose}
                    />
                )}
            </Modal>
        );
    }

    _onSubmit(values) {
        validate(values, [
            ['projectLink', function (values) {
                if (/\w+-\w+-\w+-\w+-\w+/.test(_get(values, 'projectLink')) === false) {
                    return __('URL is not valid');
                }
            }]
        ]);
        const projectUid = values.projectLink.match(/\w+-\w+-\w+-\w+-\w+/)[0];

        return dal.addContestToProject(this.props.contest, projectUid)
            .then(() => this.props.onClose());
    }
}
