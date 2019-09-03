import Enum from './Enum';

export default class ProjectContentEnum extends Enum {

    static PROBLEM = 'problem';
    static SOLUTION = 'solution';
    static X_FACTOR = 'xFactor';
    static WHY_SMART_CONTRACTS = 'whySmartContracts';
    static NEW_FEATURES_OR_MVP = 'newFeaturesOrMvp';
    static MARKET_STRATEGY = 'marketStrategy';
    static IMPACT_ON_COMMUNITY = 'impactOnCommunity';
    static CURRENT_STAGE = 'currentStage';
    static REWARD_TITLE_PLACEHOLDER = 'rewardTitlePlaceholder';
    static REWARD_DESC_PLACEHOLDER = 'rewardDescPlaceholder';

    static getLabels() {
        return {
            [this.PROBLEM]: __('Problem'),
            [this.SOLUTION]: __('Solution'),
            [this.X_FACTOR]: __('X-Factor'),
            [this.WHY_SMART_CONTRACTS]: __('Why smart contracts and DLT?'),
            [this.NEW_FEATURES_OR_MVP]: __('New features or MVP description '),
            [this.MARKET_STRATEGY]: __('Go to market strategy'),
            [this.IMPACT_ON_COMMUNITY]: __('Rewards for project supporters'),
            [this.CURRENT_STAGE]: __('Current stage of the project'),
        };
    }

    static getPlaceholders() {
        return {
            [this.PROBLEM]: __('Example: Coupons and discounts are very popular now. However, in order to use them, many operations from customers are required: registration, credit card, e-mail...'),
            [this.SOLUTION]: __('Example: Decentralized coupon marketplace. Where each coupon — is a digital smart asset which represents a special discount from suppliers with certain automated logic...'),
            [this.X_FACTOR]: __('Example: It\'s easy to become supplier. It\'s easy to become customer. It works everythere in the world because of crypto and smart contracts. It\'s not censored ...'),
            [this.WHY_SMART_CONTRACTS]: __('Example: Payments in crypto. Supplier\'s operations automatization. Buy/Sell operations, transfers and exchanges of tokenized coupons ...'),
            [this.NEW_FEATURES_OR_MVP]: __('Example:  1. Mainnet launch;  2. Supplier\'s account page; ...'),
            [this.MARKET_STRATEGY]: __('Example: Marketplaces are creating more use cases for DLT & Smart Contracts as well as more liquidity for crypto in general ... '),
            [this.IMPACT_ON_COMMUNITY]: __('Example: Marketplaces are creating more use cases for DLT & Smart Contracts as well as more liquidity for crypto in general ...'),
            [this.CURRENT_STAGE]: __('Example: 1. Product design and users journey - DONE; 2. Smart Contracts and business logic - DONE; 3. Application UI - IN PROGRESS; 4. Marketing materials - IN PROGRESS...'),
            [this.REWARD_TITLE_PLACEHOLDER]: __('Ex.: Premium account'),
            [this.REWARD_DESC_PLACEHOLDER]: __('Ex.: We will give you Premium account for free'),
        };
    }

    static getPlaceholder(id) {
        return this.getPlaceholders()[id] || '';
    }

}
