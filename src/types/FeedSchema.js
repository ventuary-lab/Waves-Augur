import PropTypes from 'prop-types';
import UserSchema from 'types/UserSchema';
import ProjectVoteEnum from 'enums/ProjectVoteEnum';
import FeedTypeEnum from 'enums/FeedTypeEnum';

const FeedSchema = PropTypes.shape({
    type: PropTypes.oneOf(FeedTypeEnum.getKeys()),
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
