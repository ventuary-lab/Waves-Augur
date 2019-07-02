import _merge from 'lodash-es/merge';
import ClientStorageComponent from 'yii-steroids/components/ClientStorageComponent';
import HttpComponent from 'yii-steroids/components/HttpComponent';
import HtmlComponent from 'yii-steroids/components/HtmlComponent';
import LocaleComponent from 'yii-steroids/components/LocaleComponent';
import ResourceComponent from 'yii-steroids/components/ResourceComponent';
import StoreComponent from 'yii-steroids/components/StoreComponent';
import UiComponent from 'yii-steroids/components/UiComponent';
import DalComponent from './DalComponent';

// Create instances
const clientStorage = new ClientStorageComponent();
const http = new HttpComponent();
const html = new HtmlComponent();
const locale = new LocaleComponent();
const resource = new ResourceComponent();
const store = new StoreComponent();
const ui = new UiComponent();
const dal = new DalComponent();

// Apply configuration
const customConfig = store.getState().config || {};
_merge(clientStorage, customConfig.clientStorage);
_merge(http, customConfig.http);
_merge(html, customConfig.html);
_merge(locale, customConfig.locale);
_merge(resource, customConfig.resource);
_merge(store, customConfig.store);
_merge(ui, customConfig.ui);
_merge(dal, customConfig.dal);

export {
    clientStorage,
    http,
    html,
    locale,
    resource,
    store,
    ui,
    dal,
};
