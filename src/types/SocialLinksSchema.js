import PropTypes from 'prop-types';
import SocialEnum from 'enums/SocialEnum';

const SocialLinksSchema = PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOf(SocialEnum.getKeys()),
    link: PropTypes.string,
}));

export default SocialLinksSchema;
