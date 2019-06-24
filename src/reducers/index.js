import {combineReducers} from 'redux';
import * as reducers from 'yii-steroids/reducers';

export default asyncReducers => combineReducers({
    ...reducers,
    ...asyncReducers,
});
