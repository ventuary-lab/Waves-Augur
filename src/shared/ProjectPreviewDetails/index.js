import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { html } from 'components';

import './ProjectPreviewDetails.scss';

import leftArrowIcon from 'static/icons/slider-arrow-left.svg';

import {
    generateBottomImagesGrid
} from './utils';

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

        this._slickSettings = {
            dots: false,
            arrows: false
        };

        this._totalPreviewsLength = _.get(this.props, 'previews.length', 0);
        this._lastIndex = this._totalPreviewsLength - 1;

        this.sliderRef = React.createRef();
        this.bottomSliderRef = React.createRef();

        this.state = {
            currentIndex: 0
        };
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
        this.bottomSliderRef.current.slickGoTo(newIndex);

        this.setState({ currentIndex: newIndex });
    }

    _mapImageToCell (imgUrl, className = 'bottom-img', isCurrent = false) {
        const clist = [
            bem.element('slide-img', className),
            isCurrent ? 'current' : ''
        ].join(' ');
        return (
            <div className={clist}>
                <img src={imgUrl}/>
            </div>
        );
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
            className: bem.element('top-slider')
        };
    }

    _computeBottomSliderProps () {
        return {
            ...this._slickSettings,
            slidesToShow: 3,
            slidesToScroll: 3,
            className: bem.element('bottom-slider')
        };
    };

    render() {
        const { previews } = this.props;

        if (previews.length < 1) {
            return null;
        };
        const { _onNext, _onPrev, _computeTopSliderProps, _computeBottomSliderProps } = this;
        const { currentIndex } = this.state;

        const renderReadyPreviews = previews.map(img => this._mapImageToCell(img, 'top-img'));
        const bottomPreviews = previews.map((img, imgIndex) => this._mapImageToCell(img, 'bottom-img', imgIndex === currentIndex));

        return (
            <div className={bem.element('root')}>
                <div className={bem.element('root-container')}>
                    <SideArrow onClick={_onPrev}/>
                    <Slider
                        ref={this.sliderRef} {..._computeTopSliderProps()}>
                        {renderReadyPreviews}
                    </Slider>
                    <SideArrow reversed={true}  onClick={_onNext}/>
                </div>
                <div className={bem.element('bottom-container')}>
                    <SideArrow onClick={_onPrev}/>
                    <Slider ref={this.bottomSliderRef} {..._computeBottomSliderProps()}>
                        {bottomPreviews}
                    </Slider>
                    <SideArrow reversed={true} onClick={_onNext}/>
                </div>
            </div>
        );
    }
}

export default ProjectPreviewDetails;