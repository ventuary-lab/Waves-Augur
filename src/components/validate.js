import _isString from 'lodash/isString';
import _isInteger from 'lodash/isInteger';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import {SubmissionError} from 'redux-form';

const validate = function (data, attributes, rule, params = {}) {
    attributes = [].concat(attributes);

    const errors = {};
    attributes.forEach(attribute => {
        let value = _get(data, attribute);
        switch (rule) {
            case 'required':
                if (!value) {
                    errors[attribute] = __('Field is required');
                }
                break;

            case 'date':
                // TODO
                break;

            case 'string':
                params.max = params.max || 1000;
                if (value) {
                    if (_isInteger(value)) {
                        value = String(value);
                    }
                    if (!_isString(value)) {
                        errors[attribute] = __('Field must be string');
                    } else if (_size(value) > params.max) {
                        errors[attribute] = __('String is too long, max: {max}', {
                            max: params.max,
                        });
                    }
                }
                break;
        }
        _set(data, attribute, value);
    });

    if (!_isEmpty(errors)) {
        throw new SubmissionError(errors);
    }

};

validate.error = (attribute, message) => {
    throw new SubmissionError({
        [attribute]: message,
    });
};

export default validate;
