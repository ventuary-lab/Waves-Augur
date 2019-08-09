import {combineReducers} from 'redux';
import * as reducers from 'yii-steroids/reducers';
import layout from './layout';

export default asyncReducers => combineReducers({
    layout,
    ...reducers,
    ...asyncReducers,
});
