import {combineReducers} from 'redux';
import * as reducers from 'yii-steroids/reducers';
import api from './api';
import layout from './layout';

export default asyncReducers => combineReducers({
    api,
    layout,
    ...reducers,
    ...asyncReducers,
});
