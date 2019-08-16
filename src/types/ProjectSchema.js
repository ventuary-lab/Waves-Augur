import PropTypes from 'prop-types';
import ProjectReportReasonsEnum from 'enums/ProjectReportReasonsEnum';
import ProjectReportEnum from '../enums/ProjectReportEnum';

const ProjectSchema = PropTypes.shape({
    uid: PropTypes.string,
    name: PropTypes.string,
    positiveBalance: PropTypes.number,
    negativeBalance: PropTypes.number,
    status: PropTypes.string,
    logoUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    expireVoting: PropTypes.string,
    expireCrowd: PropTypes.string,
    expireWhale: PropTypes.string,
    targetWaves: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    country: PropTypes.string,
    isImVoted: PropTypes.bool,
    isVotingAvailable: PropTypes.bool,
    canEdit: PropTypes.bool,
    canVote: PropTypes.bool,
    canDonate: PropTypes.bool,
    canWhale: PropTypes.bool,
    canReport: PropTypes.bool,
    canReportVoting: PropTypes.bool,
    canContestWinner: PropTypes.bool,
    contents: PropTypes.shape({
        problem: PropTypes.string,
        solution: PropTypes.string,
        xFactor: PropTypes.string,
        mvp: PropTypes.string,
        whySmartContracts: PropTypes.string,
        newFeaturesOrMvp: PropTypes.string,
        marketStrategy: PropTypes.string,
        impactOnCommunity: PropTypes.string,
        currentStage: PropTypes.string,
    }),
    contest: PropTypes.string,
    contestWinner: PropTypes.string,
    socials: PropTypes.shape({
        url_twitter: PropTypes.string,
        // url_facebook: PropTypes.string,
        // url_linkedin: PropTypes.string,
        // url_instagram: PropTypes.string,
        // url_telegram: PropTypes.string,
        // url_website: PropTypes.string,
    }),
    blocks: PropTypes.shape({
        create: PropTypes.number,
        votingEnd: PropTypes.number,
        crowdfundEnd: PropTypes.number,
        whaleEnd: PropTypes.number,
    }),
    votesCount: PropTypes.shape({
        featured: PropTypes.number,
        delisted: PropTypes.number,
    }),
    lastReports: PropTypes.arrayOf(PropTypes.shape({
        report: PropTypes.shape({
            id: PropTypes.number,
            direction: PropTypes.oneOf(ProjectReportEnum.getKeys()),
        }),
        author: PropTypes.string,
    })),
    nextReportId: PropTypes.number,
    isDelisted: PropTypes.bool,
    delistedReason: PropTypes.oneOf(ProjectReportReasonsEnum.getKeys()),
});

export default ProjectSchema;
