import React from 'react';
import Router from 'yii-steroids/ui/nav/Router';

import {ui} from 'components';
import Layout from 'shared/Layout';
import routes from './routes';

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

    render() {
        return (
            <Router
                wrapperView={Layout}
                routes={routes}
            />
        );
    }
}
