import React from 'react';
import PropTypes from 'prop-types';
import _isFunction from 'lodash-es/isFunction';

import {html} from 'components';
import Form from 'yii-steroids/ui/form/Form';
import Button from 'yii-steroids/ui/form/Button';
import validate from 'shared/validate';

import './FormWizard.scss';

const bem = html.bem('FormWizard');

export default class FormWizard extends React.PureComponent {

    static propTypes = {
        formId: PropTypes.string.isRequired,
        onSubmit: PropTypes.func,
        onComplete: PropTypes.func,
        onFirstBack: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            component: PropTypes.func,
            componentProps: PropTypes.object,
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
                    {this.props.items.map((item, index) => (
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
                    {this.props.title && (
                        <div className={bem.element('title')}>
                            {this.props.title}
                        </div>
                    )}
                    {this.renderContent()}
                </div>
                <div className={bem.element('controls')}>
                    <div className={bem.element('control-back')}>
                        {this.props.onFirstBack && _isFunction(this.props.onFirstBack) && this.getActiveIndex() === 0 && (
                            <Button
                                layout={'default'}
                                color='primary'
                                onClick={this.props.onFirstBack}
                                link
                            >
                                {__('Back')}
                            </Button>
                        )}
                        {this.getActiveIndex() > 0 && (
                            <Button
                                layout={'default'}
                                color='primary'
                                onClick={() => this.switchTab(-1)}
                                link
                            >
                                {__('Back')}
                            </Button>
                        )}
                    </div>
                    <div className={bem.element('control-next')}>
                        <Button
                            type='submit'
                            color='primary'
                            layout={'default'}
                        >
                            {__('Next')}
                        </Button>
                    </div>
                </div>
            </Form>
        );
    }

    renderContent() {
        const item = this.props.items[this.getActiveIndex()];
        const Component = item.component;
        return (
            <Component {...item.componentProps}/>
        );
    }

    switchTab(direction) {
        const newIndex = Math.max(0, Math.min(this.props.items.length - 1, this.getActiveIndex() + direction));
        this.setState({
            activeId: this.props.items[newIndex].id,
        });
    }

    _onSubmit(values) {
        const item = this.props.items[this.getActiveIndex()];
        if (item.validators) {
            validate(values, item.validators);
        }

        const isFinish = this.getActiveIndex() === this.props.items.length - 1;
        if (isFinish) {
            if (this.props.onSubmit) {
                return Promise.resolve(this.props.onSubmit(values))
                    .then(() => {
                        this.props.onComplete && this.props.onComplete();
                    });
            }
        } else {
            this.switchTab(1);
        }
    }
}
