import React from 'react';
import PropTypes from 'prop-types';
import _times from 'lodash-es/times';

import {html} from 'components';
import Form from 'yii-steroids/ui/form/Form';
import Button from 'yii-steroids/ui/form/Button';

import './FormWizard.scss';

const bem = html.bem('FormWizard');

export default class FormWizard extends React.PureComponent {

    static propTypes = {
        formId: PropTypes.string.isRequired,
        onSubmit: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            component: PropTypes.func,
        })),
    };

    constructor() {
        super(...arguments);

        this._onSubmit = this._onSubmit.bind(this);

        this.state = {
            activeId: this.props.items[0].id,
        };
    }

    getActiveIndex() {
        return this.props.items.findIndex(item => item.id === this.state.activeId);
    }

    render() {
        return (
            <Form
                {...this.props}
                onSubmit={this._onSubmit}
                className={bem(bem.block(), this.props.className)}
            >
                <div className={bem.element('steps')}>
                    {_times(this.props.items.length).map((item, index) => (
                        <div
                            key={index}
                            className={bem.element('step', {
                                first: index === 0,
                            })}
                        >
                            {index > 0 && (
                                <div
                                    className={bem.element('step-line', {
                                        filled: index <= this.getActiveIndex(),
                                    })}
                                />
                            )}
                            <div
                                className={bem.element('step-point', {
                                    filled: index <= this.getActiveIndex(),
                                })}
                            />
                        </div>
                    ))}
                </div>
                <div className={bem.element('content')}>
                    {this.renderContent()}
                </div>
                <div className={bem.element('controls')}>
                    {this.getActiveIndex() > 0 && (
                        <Button
                            color='primary'
                            onClick={() => this.switchTab(-1)}
                            outline
                        >
                            {__('Back')}
                        </Button>
                    )}
                    <Button
                        type='submit'
                        color='primary'
                        outline
                    >
                        {__('Next')}
                    </Button>
                </div>
            </Form>
        );
    }

    renderContent() {
        const Component = this.props.items[this.getActiveIndex()].component;
        return (
            <Component/>
        );
    }

    switchTab(direction) {
        const newIndex = Math.max(0, Math.min(this.props.items.length - 1, this.getActiveIndex() + direction));
        this.setState({
            activeId: this.props.items[newIndex].id,
        });
    }

    _onSubmit(values) {
        const isFinish = this.getActiveIndex() === this.props.items.length - 1;
        if (isFinish) {
            this.props.onSubmit && this.props.onSubmit(values);
        } else {
            this.switchTab(1);
        }
    }
}
