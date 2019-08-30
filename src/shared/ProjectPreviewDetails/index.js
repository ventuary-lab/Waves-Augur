import React from 'react';
import PropTypes from 'prop-types';
import { html } from 'components';

import './ProjectPreviewDetails.scss';

const bem = html.bem('ProjectPreviewDetails');

class ProjectPreviewDetails extends React.PureComponent {
    static propTypes = {
        previews: PropTypes.array
    }

    constructor(props) {
        super(props);


    }

    render() {
        const { previews } = this.props;

        if (previews.length < 1) {
            return null;
        }

        return (
            <div className={bem.element('root')}>
                <div>
                    
                </div>
                <div>

                </div>
            </div>
        )
    }
}

export default ProjectPreviewDetails;