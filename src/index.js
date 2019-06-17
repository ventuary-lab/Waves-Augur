import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {store} from 'components';

import Application from './Application.jsx';
import './style/index.scss';

ReactDOM.render(
    <Provider store={store.store}>
        <Application/>
    </Provider>,
    document.getElementById('root'),
);
