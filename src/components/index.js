import _merge from 'lodash-es/merge';
import ClientStorageComponent from 'yii-steroids/components/ClientStorageComponent';
import HtmlComponent from 'yii-steroids/components/HtmlComponent';
import HttpComponent from 'yii-steroids/components/HttpComponent';
import LocaleComponent from 'yii-steroids/components/LocaleComponent';
import StoreComponent from 'yii-steroids/components/StoreComponent';
import UiComponent from 'yii-steroids/components/UiComponent';
import LanguageEnum from 'enums/LanguageEnum';

// Create instances
const clientStorage = new ClientStorageComponent();
const html = new HtmlComponent();
const http = new HttpComponent();
const locale = new LocaleComponent();
const store = new StoreComponent();
const ui = new UiComponent();

locale.getUrl = function(url) {
    return this.language === LanguageEnum.RU
        ? url
        : `/${this.language}${url}`;
};

// Apply configuration
const customConfig = store.getState().config || {};
_merge(clientStorage, customConfig.clientStorage);
_merge(html, customConfig.html);
_merge(http, customConfig.http);
_merge(locale, customConfig.locale);
_merge(store, customConfig.store);
_merge(ui, customConfig.ui);

export {
    clientStorage,
    html,
    http,
    locale,
    store,
    ui,
};
