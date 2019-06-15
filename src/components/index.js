import _merge from 'lodash-es/merge';

import ClientStorageComponent from 'yii-steroids/components/ClientStorageComponent';
import HtmlComponent from 'yii-steroids/components/HtmlComponent';
import HttpComponent from 'yii-steroids/components/HttpComponent';
import LocaleComponent from 'yii-steroids/components/LocaleComponent';
import ResourceComponent from 'yii-steroids/components/ResourceComponent';
import StoreComponent from 'yii-steroids/components/StoreComponent';
import UiComponent from 'yii-steroids/components/UiComponent';

// Create instances
export const clientStorage = new ClientStorageComponent();
export const html = new HtmlComponent();
export const http = new HttpComponent();
export const locale = new LocaleComponent();
export const resource = new ResourceComponent();
export const store = new StoreComponent();
export const ui = new UiComponent();

const instances = {
    clientStorage,
    html,
    http,
    locale,
    resource,
    store,
    ui
};

Object.keys(instances).forEach(name => {
    _merge( instances[name] || {});
});
