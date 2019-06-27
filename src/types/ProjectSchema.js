import PropTypes from 'prop-types';

const ProjectSchema = PropTypes.shape({
    address: PropTypes.string,
    title: PropTypes.string,
    logoUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    expireVoting: PropTypes.string,
    expireCrowd: PropTypes.string,
    expireWhale: PropTypes.string,
    targetWaves: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    country: PropTypes.string,
    contents: PropTypes.shape({
        problem: PropTypes.string,
        solution: PropTypes.string,
        xFactor: PropTypes.string,
        mvp: PropTypes.string,
        largeScaleAdoption: PropTypes.string,
        impactOnUser: PropTypes.string,
        impactOnUserContext: PropTypes.string,
        impactOnUserSociety: PropTypes.string,
        codeValidation: PropTypes.string,
        legalArrangements: PropTypes.string,
        openSourceStrategy: PropTypes.string,
        interconnectedness: PropTypes.string,
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

export default ProjectSchema;
