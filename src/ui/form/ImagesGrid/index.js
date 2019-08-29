import React from 'react';
import PropTypes from 'prop-types';
import { html } from 'components';
import crossIcon from 'static/icons/cross.svg';

import './ImagesGrid.scss';

const bem = html.bem('ImagesGrid');

class ImagesGrid extends React.PureComponent {
    static propTypes = {
        onRemove: PropTypes.func,
        images: PropTypes.array
    }

    constructor(props) {
        super(props);

        this._mapImageToCell = this._mapImageToCell.bind(this);
        this._onRemove = this.props.onRemove || (() => {});
    }

    _mapImageToCell (imgSource, imgIndex) {
        return (
            <div>
                <img src={crossIcon} className={bem.element('cross-icon')} onClick={() => this._onRemove(imgIndex)}/>
                <img src={imgSource}className={bem.element('main-img')} />
            </div>
        );
    }

    render() {
        const { images } = this.props;

        if (!images || images.length <= 0) {
            return null;
        };

        return (
            <div className={bem.element('root-grid')}>
                {images.map(this._mapImageToCell)}
            </div>
        );
    }
}

export default React.memo(ImagesGrid);