import React from 'react';
import Router from 'yii-steroids/ui/nav/Router';
import axios from 'axios';

import {ui} from 'components';
import Layout from 'shared/Layout';
import routes from './routes';
import './static/images/favicon.ico';

// Automatically import all views from yii-steroids
ui.addViews({
    'form.FormView': require('yii-steroids/ui/form/Form/FormView').default,
    'form.InputFieldView': require('yii-steroids/ui/form/InputField/InputFieldView').default,
    'form.CheckboxFieldView': require('yii-steroids/ui/form/CheckboxField/CheckboxFieldView').default,
    'form.TextFieldView': require('yii-steroids/ui/form/TextField/TextFieldView').default,
    'form.ButtonView': require('yii-steroids/ui/form/Button/ButtonView').default,
    'form.DateFieldView': require('yii-steroids/ui/form/DateField/DateFieldView').default,
    'list.ListView': require('yii-steroids/ui/list/List/ListView').default,
    'list.EmptyView': require('yii-steroids/ui/list/Empty/EmptyView').default,
});
ui.addViews(require.context('./ui', true, /View.js$/));

export default class Application extends React.PureComponent {
    constructor() {
        this.state = {
            varsInitialized: false
        };
    }

    componentDidMount () {
        (async () => {
            const response = await axios.get('/get-dapp-info');
            const { APP_DAPP_NETWORK, DAPP } = response.data;
            window.APP_DAPP_NETWORK = APP_DAPP_NETWORK;
            window.DAPP = DAPP;
            this.setState({ varsInitialized: true });
        })();

    }

    render() {
        const { varsInitialized } = this.state;

        return varsInitialized ? (
            <Router
                wrapperView={Layout}
                routes={routes}
            />
        ) : null;
    }
}
