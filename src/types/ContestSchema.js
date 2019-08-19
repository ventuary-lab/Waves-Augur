import PropTypes from 'prop-types';

const ContestSchema = PropTypes.shape({
    uid: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    logoUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    coverSmallUrl: PropTypes.string,
    expireEntries: PropTypes.string,
    expireImplementation: PropTypes.string,
    rewardWaves: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    contents: PropTypes.shape({
        appDescription: PropTypes.string,
        theme: PropTypes.string,
        screenDescription: PropTypes.string,
        links: PropTypes.string,
        platform: PropTypes.string,
        deliverables: PropTypes.string,
    }),
    socials: PropTypes.shape({
        url_twitter: PropTypes.string,
        url_facebook: PropTypes.string,
        url_telegram: PropTypes.string,
        url_website: PropTypes.string,
    }),
    blocks: PropTypes.shape({
        create: PropTypes.number,
        entriesEnd: PropTypes.number,
        implementationEnd: PropTypes.number,
    }),
});

export default ContestSchema;
