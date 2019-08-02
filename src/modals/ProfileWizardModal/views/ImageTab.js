import React from 'react';
import ImageField from 'ui/form/ImageField';

import {html} from 'components';


import './ImageTab.scss';

const bem = html.bem('ImageTab');

export default class ImageTab extends React.Component {

    render() {
        return (
            <div className={bem.block()}>
                <h3 className={bem.element('title')}>
                    {__('About You')}
                </h3>
                <div className={bem.element('sub-title')}>
                    {__('Add Your Avatar')}
                </div>
                <ImageField
                    uploadApi={'/upload'}
                    attribute='avatar'
                />
            </div>
        );
    }
}
