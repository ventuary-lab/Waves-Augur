import PropTypes from 'prop-types';

const UserSchema = PropTypes.shape({
    address: PropTypes.string,
    name: PropTypes.string,
    balance: PropTypes.number,
    role: PropTypes.string,
    avatar: PropTypes.string,
    title: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
    invitedBy: PropTypes.shape({
        address: PropTypes.string,
        name: PropTypes.string,
    }),
    socials: PropTypes.shape({
        url_twitter: PropTypes.string,
        url_facebook: PropTypes.string,
        url_linkedin: PropTypes.string,
        url_instagram: PropTypes.string,
        url_telegram: PropTypes.string,
        url_website: PropTypes.string,
    }),
});

export default UserSchema;
