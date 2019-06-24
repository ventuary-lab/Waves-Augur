import React from 'react';
import Router from 'ui/nav/Router';
import navigationHoc from 'ui/nav/navigationHoc';

import { ui } from './components';
import Layout from './shared/Layout';
import routesTree from './routes';

// Automatically import all views from yii-steroids
ui.addViews(require.context('./ui', true, /View.js?$/));

// Automatically import all fields and formatters from yii-steroids
ui.addFields(require.context('./ui', true, /Field.js$/));
ui.addFormatters(require.context('./ui', true, /Formatter.js$/));

import DAL from './dal/DataAccessLayer';

import ProfilePopup from 'ui/modal/ProfileModal';

class Application extends React.PureComponent {

    static treeToList(item: any) {
        let items = [item];
        if (item.items) {
            item.items.forEach((sub: any) => {
                items = items.concat(Application.treeToList(sub));
            });
        }
        return items;
    }

    componentDidMount () {
        // @ts-ignore
        window.DAL = DAL;        
    }

    render() {

        return (
            <>
                <ProfilePopup />
                <Router
                    wrapperView={Layout}
                    routes={Application.treeToList(routesTree)}
                />
            </>
        )
    }
}

export default navigationHoc(routesTree)(Application);