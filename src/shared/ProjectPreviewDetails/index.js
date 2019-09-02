import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { html } from 'components';

import './ProjectPreviewDetails.scss';

import leftArrowIcon from 'static/icons/slider-arrow-left.svg';
import crossIcon from 'static/icons/cross.svg';
import getBackArrow from 'static/icons/mobile-arrow-left.svg';

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
    const currentClassName = bem.element('preview-modal');

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
};

function MobilePreviewModal ({ previews, currentIndex, onOutClick = () => {}, onSwipe }) {
    const sliderProps = {
        dots: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        onSwipe
    };
    const images = previews.map(image => (
        <div className='mobile-img'>
            <img src={image}/>
        </div>
    ));

    return (
        <div className={bem.element('preview-mobile-modal')}>
            <div>
                <img src={getBackArrow} onClick={onOutClick}/>
                <div>{currentIndex + 1} / {previews.length}</div>
            </div>
            <div>
                <Slider {...sliderProps}>
                    {images}
                </Slider>
            </div>
        </div>
    );
};

const IMAGES_PER_ROW_COUNT_DESKTOP = 3;
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
        this._onBottomGridPrev = this._onBottomGridPrev.bind(this);
        this._onBottomGridNext = this._onBottomGridNext.bind(this);
        this._computeTopSliderProps = this._computeTopSliderProps.bind(this);
        this._computeBottomSliderProps = this._computeBottomSliderProps.bind(this);
        this._enablePreviewMode = this._enablePreviewMode.bind(this);
        this._disablePreviewMode = this._disablePreviewMode.bind(this);
        this._onSwipe = this._onSwipe.bind(this);
        this._getBottomGrid = this._getBottomGrid.bind(this);
        this._onBottomGridSwipe = this._onBottomGridSwipe.bind(this);
        this._computeNextIndex = this._computeNextIndex.bind(this);
        this._selectImage = this._selectImage.bind(this);
        this._selectValidIndex = this._selectValidIndex.bind(this);

        this._slickSettings = {
            dots: false,
            arrows: false
        };

        this._imagesPerRowCount = IMAGES_PER_ROW_COUNT_DESKTOP;
        this._totalPreviewsLength = _.get(this.props, 'previews.length', 0);
        this._lastIndex = this._totalPreviewsLength - 1;
        this._shouldRenderBottom = this._totalPreviewsLength >= 3;
        this.isMobile = document.body.clientWidth < 800;

        this.sliderRef = React.createRef();
        this.bottomSliderRef = React.createRef();

        this.state = {
            isPreviewMode: false,
            currentIndex: 0,
            bottomGridIndex: 0
        };
    }

    _enablePreviewMode () {
        this.setState({ isPreviewMode: true });
    }

    _disablePreviewMode () {
        this.setState({ isPreviewMode: false });
    }

    _computeNextIndex (currentIndex, index) {
        let newIndex = currentIndex + index;

        if (newIndex > this._lastIndex) {
            newIndex = 0;
        }
        if (newIndex < 0) {
            newIndex = this._lastIndex;
        };

        return newIndex;
    }

    _slickGoTo (index) {
        const { currentIndex } = this.state;
        const newIndex = this._computeNextIndex(currentIndex, index);

        this._selectValidIndex(newIndex, index);
    }

    _selectValidIndex (newIndex, step) {
        const { _imagesPerRowCount } = this;
        const { bottomGridIndex } = this.state;

        if (this.sliderRef.current) {
            this.sliderRef.current.slickGoTo(newIndex);
        }

        const isInBottomRange = newIndex >= bottomGridIndex && newIndex <= (bottomGridIndex + _imagesPerRowCount - 1);

        this.setState({ currentIndex: newIndex });

        if (!isInBottomRange) {
            if (step === 1) {
                this._onBottomGridNext()
            } else if (step === -1) {
                this._onBottomGridPrev();
            }
        }
    }

    _onBottomGridPrev () {
        const { bottomGridIndex } = this.state;
        const newIndex = this._computeNextIndex(bottomGridIndex, -1);

        if (newIndex >= 0) {
            this.bottomSliderRef.current.slickGoTo(newIndex);

            this.setState({ bottomGridIndex: newIndex });
        };
    }

    _onBottomGridNext () {
        const { _lastIndex } = this;
        const { bottomGridIndex } = this.state;
        const newIndex = this._computeNextIndex(bottomGridIndex, 1);

        const maxIndex = _lastIndex;

        if (newIndex < maxIndex) {
            this.bottomSliderRef.current.slickGoTo(newIndex);

            this.setState({ bottomGridIndex: newIndex });
        }
    }

    _selectImage (imgIndex) {
        this._selectValidIndex(imgIndex, null);
    }

    _mapImageToCell (imgUrl, className = 'bottom-img', {  isCurrent = false, onImageClick = () => {} }) {
        const clist = [
            bem.element('slide-img', className),
            isCurrent ? 'current' : ''
        ].join(' ');

        return (
            <div className={clist}>
                <img src={imgUrl} onClick={onImageClick}/>
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

    _onBottomGridSwipe () {}

    _computeBottomSliderProps () {
        const { _lastIndex, isMobile } = this;
        const { currentIndex } = this.state;

        const classList = [
            bem.element('bottom-slider'), 
            currentIndex === _lastIndex ? 'last-img' : ''
        ].join(' ');

        return {
            ...this._slickSettings,
            slidesToShow: isMobile ? 1 : this._imagesPerRowCount,
            slidesToScroll: 1,
            className: classList,
            onSwipe: this._onBottomGridSwipe,
            variableWidth: isMobile,
            infinite: !isMobile
        };
    };

    _getBottomGrid (previews) {
        const { 
            _shouldRenderBottom,
            isMobile,
            _computeBottomSliderProps,
            _lastIndex,
            _onBottomGridNext,
            _onBottomGridPrev,
            _imagesPerRowCount
        } = this;
        const { currentIndex, bottomGridIndex } = this.state;

        const onImageClick = (imgIndex) => {
            this._selectImage(imgIndex);

            if (isMobile) {
                this._enablePreviewMode();
            }
        };

        const bottomPreviews = previews.map((img, imgIndex) => this._mapImageToCell(img, 'bottom-img', {
            isCurrent: imgIndex === currentIndex,
            onImageClick: () => onImageClick(imgIndex)
        }));

        const isMoreThanThree = bottomPreviews.length > 3;
        const maxBottomIndex = _lastIndex - _imagesPerRowCount + 1;

        return (
            _shouldRenderBottom && (
                <div className={bem.element('bottom-container')}>
                    {bottomGridIndex > 0 && isMoreThanThree && !isMobile && <SideArrow onClick={_onBottomGridPrev}/>}
                    <Slider ref={this.bottomSliderRef} {..._computeBottomSliderProps()}>
                        {bottomPreviews}
                    </Slider>
                    {bottomGridIndex < maxBottomIndex && isMoreThanThree && !isMobile && <SideArrow reversed={true} onClick={_onBottomGridNext}/>}
                </div>
            )
        );
    }

    render() {
        const { previews } = this.props;

        if (previews.length < 1) {
            return null;
        };

        const { 
            _onNext, 
            _onPrev, 
            _onSwipe,
            _computeTopSliderProps,
            _lastIndex,
            _disablePreviewMode,
            isMobile,
            _getBottomGrid,
            _enablePreviewMode
        } = this;

        const { currentIndex, isPreviewMode } = this.state;

        const renderReadyPreviews = previews.map(img => this._mapImageToCell(img, 'top-img', {
            onImageClick: _enablePreviewMode
        }));

        const mobileModalProps = {
            isMobile,
            onNext: _onNext,
            onPrev: _onPrev,
            previews,
            currentIndex,
            onSwipe: _onSwipe,
            onOutClick: _disablePreviewMode
        };
        const previewModal = !isMobile ? <PreviewModal {...mobileModalProps}/> : <MobilePreviewModal {...mobileModalProps}/>;

        return (
            <div className={bem.element('root')}>
                {isPreviewMode && ReactDOM.createPortal(previewModal, document.body)}
                {!isMobile && <div className={bem.element('root-container')}>
                    {currentIndex > 0 && <SideArrow onClick={_onPrev}/>}
                    <Slider
                        ref={this.sliderRef} {..._computeTopSliderProps()}>
                        {renderReadyPreviews}
                    </Slider>
                    {currentIndex < _lastIndex && <SideArrow reversed={true} onClick={_onNext}/>}
                </div>}
                {_getBottomGrid(previews)}
            </div>
        );
    }
}

export default ProjectPreviewDetails;