import React from 'react';
import PropTypes from 'prop-types';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import Dropzone from 'react-dropzone';
import ImagesGrid from 'ui/form/ImagesGrid';
// import { Loader } from 'ui/anims/base-loader';

import {html} from 'components';

import './ImagePreviewsField.scss';

const bem = html.bem('ImagePreviewsField');

export default @fieldHoc({
    componentId: 'form.ImagePreviewsField',
})
class ImagePreviewsField extends React.PureComponent {

    static propTypes = {
        attribute: PropTypes.string.isRequired,
        uploadApi: PropTypes.string.isRequired,
        label: PropTypes.string,
        title: PropTypes.string,
        isCover: PropTypes.bool,
        isCoverSmall: PropTypes.bool,
    };

    constructor() {
        super(...arguments);

        const initialImages = this.props.input.value || this.props.previews || [];

        this.state = {
            file: null,
            isUploadFailed: false,
            onDragEnter: false,
            uploadedImages: initialImages
        };

        this.dropZoneRef = React.createRef();

        this._onImageRemove = this._onImageRemove.bind(this);

        this._openBrowseDialog = this._openBrowseDialog.bind(this);
        this._onDrop = this._onDrop.bind(this);
        this._onDragEnter = this._onDragEnter.bind(this);
        this._onDragLeave = this._onDragLeave.bind(this);
        this._onBrowseAccept = this._onBrowseAccept.bind(this);
        this._uploadFile = this._uploadFile.bind(this);
    }

    _onImageRemove (imgIndex) {
        const updatedImages = [...this.state.uploadedImages];
        const img = updatedImages.splice(imgIndex, 1);

        if (!img) {
            return;
        };

        this.setState({ uploadedImages: updatedImages });
    }

    render() {
        const { uploadedImages } = this.state;

        return (
            <div className={bem.block({
                'is-cover': this.props.isCover,
                'is-cover-small': this.props.isCoverSmall,
            })}>
                <ImagesGrid
                    images={this.state.uploadedImages}
                    onRemove={this._onImageRemove}
                />
                {uploadedImages.length < 10 && (
                    <div className={bem.element('drop-zone-block', {
                        'on-drag-enter': this.state.onDragEnter,
                    })}>
                        <Dropzone
                            ref={this.dropZoneRef}
                            noClick={true}
                            onDrop={this._onDrop}
                            onDragEnter={this._onDragEnter}
                            onDragLeave={this._onDragLeave}
                            accept={'image/jpeg, image/png, image/svg+xml'}
                        >
                            {({getRootProps, getInputProps}) => (
                                <div {...getRootProps({className: bem.element('drop-zone')})}>
                                    <input
                                        {...getInputProps()}
                                        name={'avatar'}
                                        onChange={this._onBrowseAccept}
                                    />
                                    <span className={bem.element('drop-zone-title')}>
                                        {this.props.title || __('Drop Your Image Here')}
                                    </span>
                                </div>
                            )}
                        </Dropzone>
                    </div>
                )}
                <div className={bem.element('upload-failed', {
                    'visible': this.state.isUploadFailed,
                })}>
                    {__('File failed to upload')}
                </div>
                {uploadedImages.length < 10 && (
                    <span
                        className={bem.element('image-choose')}
                        onClick={this._openBrowseDialog}
                    >
                        <span className={bem.element('image-choose-icon')}/>
                        {__('Choose Photo')}
                    </span>
                )}
            </div>
        );
    }

    _onDrop(files) {
        const file = files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            this._uploadFile(formData);
            this.setState({file});
        }
    }

    _onDragEnter() {
        this.setState({
            onDragEnter: true
        });
    }

    _onDragLeave() {
        this.setState({
            onDragEnter: false
        });
    }

    _openBrowseDialog() {
        if (this.dropZoneRef) {
            this.dropZoneRef.current.open();
        }
    }

    _onBrowseAccept(inputEvent) {
        const file = inputEvent.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            this._uploadFile(formData);
            this.setState({file});
        }
    }

    _uploadFile(formData) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', this.props.uploadApi, true);
        xhr.setRequestHeader('If-None-Match', '*');
        xhr.setRequestHeader('If-Modified-Since', 'Mon, 26 Jul 1997 05:00:00 GMT');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText).path;

                this.setState({
                    isUploadFailed: false,
                    value: responseData,
                });

                this.setState(prevState => ({ uploadedImages: [...prevState.uploadedImages, responseData] }));

                this.props.input.onChange(this.state.uploadedImages);

            } else {
                this.setState({
                    isUploadFailed: true
                }, () => {
                    return setTimeout(() => this.setState({
                        isUploadFailed: false
                    }), 3000);
                });
            }
        };
        xhr.send(formData);
    }

}