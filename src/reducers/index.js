import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import fields from 'yii-steroids/reducers/fields';
import list from 'yii-steroids/reducers/list';
import config from 'yii-steroids/reducers/config';
import notifications from 'yii-steroids/reducers/notifications';
import navigation from 'yii-steroids/reducers/navigation';
import modal from 'yii-steroids/reducers/modal';
import routing from 'yii-steroids/reducers/routing';

export default asyncReducers => combineReducers({
    form,
    fields,
    list,
    config,
    notifications,
    modal,
    routing,
    navigation,
    ...asyncReducers
});
