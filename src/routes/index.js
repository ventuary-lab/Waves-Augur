import {Redirect} from 'react-router';

import UserRole from 'enums/UserRole';
import IndexPage from './IndexPage';
import AboutPage from './AboutPage';
import NewsPage from './NewsPage';
import TestPage from './TestPage';
import CommunityPage from './CommunityPage';
import CampaignsPage from './CampaignsPage';
import ProfileInboxPage from './ProfileInboxPage';
import ProfileDonationPage from './ProfileDonationPage';
import ProfileProjectsPage from './ProfileProjectsPage';
import ProfileVotingPage from './ProfileVotingPage';
import ProfileInvitedPage from './ProfileInvitedPage';
import ProfileLayout from 'shared/ProfileLayout';

export const ROUTE_ROOT = 'root';
export const ROUTE_ABOUT = 'about';
export const ROUTE_FEED = 'feed';
export const ROUTE_COMMUNITY = 'community';
export const ROUTE_TEST = 'test';
export const ROUTE_CAMPAIGNS = 'campaigns';
export const ROUTE_PROFILE = 'profile';
export const ROUTE_PROFILE_INBOX = 'profile_inbox';
export const ROUTE_PROFILE_DONATION = 'profile_donation';
export const ROUTE_PROFILE_PROJECTS = 'profile_projects';
export const ROUTE_PROFILE_VOTING = 'profile_voting';
export const ROUTE_PROFILE_INVITED = 'profile_invited';

export default {
    id: ROUTE_ROOT,
    exact: true,
    path: '/',
    component: IndexPage,
    roles: UserRole.getKeys(),
    label: __('Main'),
    items: {
        [ROUTE_ABOUT]: {
            exact: true,
            path: '/about',
            component: AboutPage,
            label: __('About'),
            roles: UserRole.getKeys(),
        },
        [ROUTE_CAMPAIGNS]: {
            exact: true,
            path: '/campaigns',
            component: CampaignsPage,
            label: __('Campaigns'),
            roles: UserRole.getKeys(),
        },
        [ROUTE_COMMUNITY]: {
            exact: true,
            path: '/community',
            component: CommunityPage,
            label: __('Community'),
            roles: UserRole.getKeys(),
        },
        [ROUTE_TEST]: {
            exact: true,
            path: '/test',
            component: TestPage,
            label: __('Test'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
        },
        [ROUTE_FEED]: {
            exact: true,
            path: '/feed',
            component: NewsPage,
            label: __('Feed'),
            roles: UserRole.getKeys(),
        },
        [ROUTE_PROFILE]: {
            exact: true,
            path: '/profile',
            component: Redirect,
            componentProps: {
                to: '/profile/projects',
            },
            label: __('My profile'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
        },
        [ROUTE_PROFILE]: {
            path: '/profile',
            component: ProfileLayout,
            label: __('My profile'),
            isNavVisible: false,
            roles: UserRole.getAuth(),
            items: {
                [ROUTE_PROFILE_INBOX]: {
                    exact: true,
                    path: '/profile/inbox',
                    component: ProfileInboxPage,
                    label: __('Inbox'),
                    icon: 'Icon__notification',
                    isNavVisible: false,
                    roles: [UserRole.REGISTERED],
                },
                [ROUTE_PROFILE_DONATION]: {
                    exact: true,
                    path: '/profile/donation',
                    component: ProfileDonationPage,
                    label: __('Donation'),
                    icon: 'Icon__rhombus',
                    roles: [UserRole.REGISTERED],
                },
                [ROUTE_PROFILE_PROJECTS]: {
                    exact: true,
                    path: '/profile/projects',
                    component: ProfileProjectsPage,
                    label: __('Projects'),
                    icon: 'Icon__rocket',
                    roles: [UserRole.REGISTERED],
                },
                [ROUTE_PROFILE_VOTING]: {
                    exact: true,
                    path: '/profile/voiting',
                    component: ProfileVotingPage,
                    label: __('Voting'),
                    icon: 'Icon__voting',
                    roles: [UserRole.REGISTERED],
                },
                [ROUTE_PROFILE_INVITED]: {
                    exact: true,
                    path: '/profile/invited-users',
                    component: ProfileInvitedPage,
                    label: __('Invited Users'),
                    icon: 'Icon__invite',
                    roles: [UserRole.REGISTERED, UserRole.WHALE, UserRole.GENESIS],
                },
            },
        },
    },
};
