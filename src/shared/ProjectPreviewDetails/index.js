import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { html } from 'components';

import './ProjectPreviewDetails.scss';

const bem = html.bem('ProjectPreviewDetails');

// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

class ProjectPreviewDetails extends React.PureComponent {
    static propTypes = {
        previews: PropTypes.array
    }

    constructor(props) {
        super(props);

        this._mapImageToCell = this._mapImageToCell.bind(this);

        this._slickSettings = {
            dots: false,
            arrows: true
        };
    }

    _mapImageToCell (imgUrl, className = 'bottom-img') {
        return (
            <div className={bem.element(className)}>
                <img src={imgUrl}/>
            </div>
        );
    }

    render() {
        const { previews } = this.props;

        if (previews.length < 1) {
            return null;
        };

        const gridSlickSettings = {
            ...this._slickSettings,
            slidesPerRow: 3
        };

        return (
            <div className={bem.element('root')}>
                <div>
                    <Slider {...this._slickSettinges} className={bem.element('top-slider')}>
                        {previews.map(img => this._mapImageToCell(img, 'top-img'))}
                    </Slider>
                </div>
                <div>
                    <Slider {...gridSlickSettings}>
                        {previews.map(img => this._mapImageToCell(img, 'bottom-img'))}
                    </Slider>
                </div>
            </div>
        );
    }
}

export default ProjectPreviewDetails;