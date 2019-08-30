import React from 'react';
import PropTypes from 'prop-types';
import { html } from 'components';
import crossIcon from 'static/icons/cross-icon-artwork.svg';

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

        // this._onMouseOut = this._onMouseOut.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);

        this.state = {
            hoveredImgIndex: -1,
            isMouseDown: false,
        };
    }

    _onMouseMove (event) {
        if (this.state.isMouseDown) {
            // console.log(event.clientX, event.clientY, this.state.coords);
        }
    }

    _onMouseDown (event) {
        this.setState({
            isMouseDown: true,
        });
    }

    _onMouseUp (event) {
        this.setState({
            isMouseDown: false
        });
    }

    _onMouseEnter (index) {
        this.setState({ hoveredImgIndex: index });
    }

    _onMouseLeave () {
        this.setState({ hoveredImgIndex: -1 });
    }

    _computeSquare () {
        
    }

    _mapImageToCell (imgSource, imgIndex) {
        const isHovered = this.state.hoveredImgIndex === imgIndex;

        return (
            <div
                className={bem.element('cell', { 'hovered': isHovered })}
                onMouseDown={this._onMouseDown}
                onMouseUp={this._onMouseUp}
                onMouseMove={this._onMouseMove}
                onMouseEnter={() => this._onMouseEnter(imgIndex)}
                onMouseLeave={this._onMouseLeave}>
                {isHovered && <img src={crossIcon} className={bem.element('cross-icon')} onClick={() => this._onRemove(imgIndex)}/>}
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