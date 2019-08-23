import {combineReducers} from 'redux';
import * as reducers from 'yii-steroids/reducers';
import api from './api';
import layout from './layout';
import global_vars from './global_vars';

export default asyncReducers => combineReducers({
    api,
    layout,
    global_vars,
    ...reducers,
    ...asyncReducers,
});
