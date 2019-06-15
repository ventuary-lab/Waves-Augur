import React from 'react';
import { hot } from 'react-hot-loader';
import Router from 'yii-steroids/ui/nav/Router';

import {ui} from 'components';
import Layout from 'shared/Layout';
import routes from './routes';

// Automatically import all views from yii-steroids
ui.addViews(require.context('yii-steroids/ui', true, /View.js$/));

// Automatically import all fields and formatters from yii-steroids
ui.addFields(require.context('yii-steroids/ui', true, /Field.js$/));
ui.addFormatters(require.context('yii-steroids/ui', true, /Formatter.js$/));

@hot(module)
export default class Application extends React.PureComponent {

    static treeToList(item) {
        let items = [item];
        if (item.items) {
            item.items.forEach(sub => {
                items = items.concat(Application.treeToList(sub));
            });
        }
        return items;
    }

    render() {
        return (
            <Router
                wrapperView={Layout}
                routes={Application.treeToList(routes)}
            />
        );
    }
}
