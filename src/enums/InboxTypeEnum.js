import Enum from './Enum';

export default class InboxTypeEnum extends Enum {

    static INVITATION_ACCEPTED = 'invitation_accepted';
    static INVITATION_VOTING = 'invitation_voting';
    static PROPOSAL_ACCEPTED = 'proposal_accepted';
    static YOUR_PROPOSAL_ACCEPTED = 'your_proposal_accepted';
    static PROPOSAL_REJECTED = 'proposal_rejected';
    static YOUR_PROPOSAL_REJECTED = 'your_proposal_rejected';
    static PROPOSAL_SUPPORTED = 'proposal_supported';
    static YOUR_PROPOSAL_SUPPORTED = 'your_proposal_supported';
    static PROPOSAL_WON_GRANT = 'proposal_won_grant';
    static YOUR_PROPOSAL_WON_GRANT = 'your_proposal_won_grant';


    static getLabels() {
        return {
            [this.INVITATION_ACCEPTED]: __('Invitation  has accepted!'),
            [this.INVITATION_VOTING]: __('Invitation  for voting'),
            [this.PROPOSAL_ACCEPTED]: __('Proposal  has accepted'),
            [this.YOUR_PROPOSAL_ACCEPTED]: __('Your proposal  has accepted'),
            [this.PROPOSAL_REJECTED]: __('Proposal  has rejected'),
            [this.YOUR_PROPOSAL_REJECTED]: __('Your proposal  has rejected'),
            [this.PROPOSAL_SUPPORTED]: __('Proposal  has supported  by community'),
            [this.YOUR_PROPOSAL_SUPPORTED]: __('Your proposal  has supported  by community'),
            [this.PROPOSAL_WON_GRANT]: __('Proposal  won the grant!'),
            [this.YOUR_PROPOSAL_WON_GRANT]: __('Your proposal  won the grant!'),
        };
    }

    static getCssClasses() {
        return {
            [this.INVITATION_ACCEPTED]: 'Icon__invitation',
            [this.INVITATION_VOTING]: 'Icon__invitation-voting',
            [this.PROPOSAL_ACCEPTED]: 'Icon__proposal-accepted',
            [this.YOUR_PROPOSAL_ACCEPTED]: 'Icon__proposal-accepted',
            [this.PROPOSAL_REJECTED]: 'Icon__proposal-rejected',
            [this.YOUR_PROPOSAL_REJECTED]: 'Icon__proposal-rejected',
            [this.PROPOSAL_SUPPORTED]: 'Icon__proposal-supported',
            [this.YOUR_PROPOSAL_SUPPORTED]: 'Icon__proposal-supported',
            [this.PROPOSAL_WON_GRANT]: 'Icon__proposal-won-grant',
            [this.YOUR_PROPOSAL_WON_GRANT]: 'Icon__proposal-won-grant',
        };
    }
}
