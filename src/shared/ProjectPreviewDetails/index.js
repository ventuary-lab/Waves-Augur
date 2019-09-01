import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { html } from 'components';

import './ProjectPreviewDetails.scss';

import leftArrowIcon from 'static/icons/slider-arrow-left.svg';
import crossIcon from 'static/icons/cross.svg';

const bem = html.bem('ProjectPreviewDetails');

function SideArrow({ reversed = false, ...restProps }) {
    const style = {
        transform: reversed ? 'rotate(180deg)' : ''
    };
    const className = [
        bem.element('slide-arrow'),
        reversed ? 'right' : ''
    ].join(' ');

    return (
        <div {...restProps} className={className}>
            <img src={leftArrowIcon} style={style}/>
        </div>
    );
}

function PreviewModal ({ previews, currentIndex, onOutClick = () => {}, onNext, onPrev }) {
    const currentClassName = 'preview-modal';

    const onClick = (event) => {
        if (event.target.classList.contains(currentClassName)) {
            onOutClick();
        }
    };

    return (
        <div className={currentClassName} onClick={onClick}>
            <div>
                <div>
                    <img src={previews[currentIndex]}/>
                </div>
                <div>
                    <span>{currentIndex + 1} / {previews.length}</span>
                    <img src={leftArrowIcon} onClick={onPrev}/>
                    <img src={leftArrowIcon} style={{ transform: 'rotate(180deg)' }} onClick={onNext}/>
                    <img src={crossIcon} onClick={onOutClick}/>
                </div>
            </div>
        </div>
    );
}

class ProjectPreviewDetails extends React.PureComponent {
    static propTypes = {
        previews: PropTypes.array
    }

    constructor(props) {
        super(props);

        this._mapImageToCell = this._mapImageToCell.bind(this);

        this._slickGoTo = this._slickGoTo.bind(this);
        this._onNext = this._onNext.bind(this);
        this._onPrev = this._onPrev.bind(this);
        this._computeTopSliderProps = this._computeTopSliderProps.bind(this);
        this._computeBottomSliderProps = this._computeBottomSliderProps.bind(this);
        this._slideBottomGrid = this._slideBottomGrid.bind(this);
        this._enablePreviewMode = this._enablePreviewMode.bind(this);
        this._disablePreviewMode = this._disablePreviewMode.bind(this);
        this._onSwipe = this._onSwipe.bind(this);

        this._slickSettings = {
            dots: false,
            arrows: false
        };

        this._totalPreviewsLength = _.get(this.props, 'previews.length', 0);
        this._lastIndex = this._totalPreviewsLength - 1;
        this._shouldRenderBottom = this._totalPreviewsLength >= 3;
        // this.bottomSlideIndices

        this.sliderRef = React.createRef();
        this.bottomSliderRef = React.createRef();

        this.state = {
            isPreviewMode: false,
            currentIndex: 0
        };
    }

    _enablePreviewMode () {
        this.setState({ isPreviewMode: true });
    }

    _disablePreviewMode () {
        this.setState({ isPreviewMode: false });
    }

    _slickGoTo (index) {
        const { currentIndex } = this.state;
        let newIndex = currentIndex + index;

        if (newIndex > this._lastIndex) {
            newIndex = 0;
        }
        if (newIndex < 0) {
            newIndex = this._lastIndex;
        }

        this.sliderRef.current.slickGoTo(newIndex);
        // this._slideBottomGrid(newIndex);

        this.setState({ currentIndex: newIndex });
    }

    _slideBottomGrid (newIndex) {
        if (this._totalPreviewsLength <= 3) {
            return;
        }
        const { currentIndex } = this.state;
        const isNext = newIndex > currentIndex;

        if (isNext && newIndex % 3 === 0) {
            this.bottomSliderRef.current.slickGoTo(newIndex);
        };
    }

    _mapImageToCell (imgUrl, className = 'bottom-img', isCurrent = false) {
        const clist = [
            bem.element('slide-img', className),
            isCurrent ? 'current' : ''
        ].join(' ');
        return (
            <div className={clist} onClick={this._enablePreviewMode}>
                <img src={imgUrl}/>
            </div>
        );
    }

    _onSwipe (direction) {
        switch (direction) {
            case 'left':
                this._onNext();
                break;
            case 'right':
                this._onPrev();
                break;
        }
    }

    _onNext () {
        this._slickGoTo(1);
    }

    _onPrev () {
        this._slickGoTo(-1);
    }

    _computeTopSliderProps () {
        return {
            ...this._slickSettings,
            className: bem.element('top-slider'),
            onSwipe: this._onSwipe
        };
    }

    _computeBottomSliderProps () {
        return {
            ...this._slickSettings,
            slidesToShow: 3,
            slidesToScroll: 1,
            className: bem.element('bottom-slider'),
            onSwipe: this._onSwipe
        };
    };

    render() {
        const { previews } = this.props;

        if (previews.length < 1) {
            return null;
        };
        const { _onNext, _onPrev, _computeTopSliderProps, _computeBottomSliderProps, _lastIndex, _shouldRenderBottom, _disablePreviewMode } = this;
        const { currentIndex, isPreviewMode } = this.state;

        const renderReadyPreviews = previews.map(img => this._mapImageToCell(img, 'top-img'));
        const bottomPreviews = previews.map((img, imgIndex) => this._mapImageToCell(img, 'bottom-img', imgIndex === currentIndex));
        const isMoreThanThree = bottomPreviews.length > 3;

        return (
            <div className={bem.element('root')}>
                {isPreviewMode && (
                    ReactDOM.createPortal(
                        <PreviewModal
                            onNext={_onNext}
                            onPrev={_onPrev}
                            previews={previews}
                            currentIndex={currentIndex}
                            onOutClick={_disablePreviewMode}
                        />,
                        document.body
                    )
                )}
                <div className={bem.element('root-container')}>
                    <SideArrow onClick={_onPrev}/>
                    <Slider
                        ref={this.sliderRef} {..._computeTopSliderProps()}>
                        {renderReadyPreviews}
                    </Slider>
                    <SideArrow reversed={true} onClick={_onNext}/>
                </div>
                {_shouldRenderBottom && (
                    <div className={bem.element('bottom-container')}>
                        {currentIndex > 0 && isMoreThanThree && <SideArrow />}
                        <Slider ref={this.bottomSliderRef} {..._computeBottomSliderProps()}>
                            {bottomPreviews}
                        </Slider>
                        {currentIndex < _lastIndex && isMoreThanThree && <SideArrow reversed={true} />}
                    </div>
                )}
            </div>
        );
    }
}

export default ProjectPreviewDetails;