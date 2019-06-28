import PropTypes from 'prop-types';
import UserSchema from 'types/UserSchema';
import ProjectVoteEnum from 'enums/ProjectVoteEnum';

const FeedSchema = PropTypes.shape({
    type: PropTypes.string,
    user: UserSchema,
    review: PropTypes.shape({
        comment: PropTypes.stirng,
        createTime: PropTypes.string,
    }),
    reviewNumber: PropTypes.number,

    // VOTE
    vote: PropTypes.oneOf(ProjectVoteEnum.getKeys()),

    // DONATE
    amount: PropTypes.number,

});

export default FeedSchema;
