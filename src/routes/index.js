import {Redirect, Route} from 'react-router';
import React from 'react';

import UserRole from 'enums/UserRole';
import IndexPage from './IndexPage';
import NewsPage from './NewsPage';
import CommunityPage from './CommunityPage';
import ProjectsPage from './ProjectsPage';
import ContestsPage from './ContestsPage';
import ProfileInboxPage from './ProfileInboxPage';
import ProfileDonationPage from './ProfileDonationPage';
import ProfileProjectsPage from './ProfileProjectsPage';
import ProfileVotingPage from './ProfileVotingPage';
import ProfileInvitedPage from './ProfileInvitedPage';
import ProfileContestsPage from './ProfileContestsPage';
import ProfileGrantsPage from './ProfileGrantsPage';
import ProfileLayout from 'shared/ProfileLayout';
import ProjectLayout from 'shared/ProjectLayout';
import ContestLayout from 'shared/ContestLayout';
import InvoiceLayout from 'shared/InvoiceLayout';
import ContestDetailsPage from './ContestDetailsPage';
import ContestEntriesPage from './ContestEntriesPage';
import ProjectFeedPage from './ProjectFeedPage';
import ProjectDetailsPage from './ProjectDetailsPage';
import ProjectNewsPage from './ProjectNewsPage';
import ProjectReviewPage from './ProjectReviewPage';

export const ROUTE_ROOT = 'root';
export const ROUTE_FEED = 'feed';
export const ROUTE_ABOUT_REDIRECT = 'about_redirect';
export const ROUTE_COMMUNITY = 'community';
export const ROUTE_CONTESTS = 'contests';
export const ROUTE_CONTESTS_REDIRECT = 'contests_redirect';
export const ROUTE_PROJECTS = 'projects';
export const ROUTE_PROJECTS_REDIRECT = 'projects_redirect';
export const ROUTE_PROFILE = 'profile';
export const ROUTE_PROFILE_REDIRECT = 'profile_redirect';
export const ROUTE_PROFILE_INBOX = 'profile_inbox';
export const ROUTE_PROFILE_DONATION = 'profile_donation';
export const ROUTE_PROFILE_PROJECTS = 'profile_projects';
export const ROUTE_PROFILE_VOTING = 'profile_voting';
export const ROUTE_PROFILE_INVITED = 'profile_invited';
export const ROUTE_PROFILE_GRANTS = 'profile_grants';
export const ROUTE_PROFILE_CONTESTS = 'profile_contests';
export const ROUTE_USER = 'user';
export const ROUTE_USER_REDIRECT = 'user_redirect';
export const ROUTE_USER_INBOX = 'user_inbox';
export const ROUTE_USER_DONATION = 'user_donation';
export const ROUTE_USER_PROJECTS = 'user_projects';
export const ROUTE_USER_VOTING = 'user_voting';
export const ROUTE_USER_INVITED = 'user_invited';
export const ROUTE_USER_GRANTS = 'user_grants';
export const ROUTE_PROJECT = 'project';
export const ROUTE_PROJECT_REDIRECT = 'project_redirect';
export const ROUTE_PROJECT_FEED = 'project_feed';
export const ROUTE_PROJECT_DETAILS = 'project_details';
export const ROUTE_PROJECT_NEWS = 'project_news';
export const ROUTE_PROJECT_REVIEW = 'project_review';
export const ROUTE_CONTEST = 'contest';
export const ROUTE_CONTEST_REDIRECT = 'contest_redirect';
export const ROUTE_CONTEST_DETAILS = 'contest_details';
export const ROUTE_CONTEST_ENTRIES = 'contest_entries';
export const ROUTE_INVOICE = 'invoice';

const baseUser = '/users/:address(\\w{35})';

export default {
    id: ROUTE_ROOT,
    exact: true,
    path: '/',
    component: IndexPage,
    roles: UserRole.getKeys(),
    label: __('Main'),
    items: {
        [ROUTE_ABOUT_REDIRECT]: {
            exact: true,
            // path: '/about',
            // component: Redirect,
            // componentProps: {
            //     to: '/',
            // },
            label: __('About'),
            roles: UserRole.getKeys(),
            externalLink: 'https://blog.wavesplatform.com/waves-labs-to-use-dao-as-sandbox-for-grant-programs-d4b58413cb50'
        },
        [ROUTE_COMMUNITY]: {
            exact: true,
            path: '/community',
            component: CommunityPage,
            label: __('Community'),
            roles: UserRole.getKeys(),
        },
        [ROUTE_PROJECT_REVIEW]: {
            exact: true,
            path: '/review/:address(\\w{35})/project/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/:type(vote|donate|whale)/:number?',
            component: ProjectReviewPage,
            label: __('Review'),
            roles: UserRole.getKeys(),
            isNavVisible: false,
        },
        [ROUTE_PROFILE_REDIRECT]: {
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
                    roles: [UserRole.REGISTERED, UserRole.ADMIN],
                    isShowImageLine: true,
                },
                [ROUTE_PROFILE_DONATION]: {
                    exact: true,
                    path: '/profile/donation',
                    component: ProfileDonationPage,
                    label: __('My Donations'),
                    icon: 'Icon__rhombus',
                    roles: [UserRole.REGISTERED, UserRole.INVITED, UserRole.ANONYMOUS, UserRole.ADMIN],
                    isShowImageLine: true,
                },
                [ROUTE_PROFILE_PROJECTS]: {
                    exact: true,
                    path: '/profile/projects',
                    component: ProfileProjectsPage,
                    label: __('My Projects'),
                    icon: 'Icon__rocket',
                    roles: [UserRole.REGISTERED, UserRole.ADMIN],
                    isShowImageLine: true,
                },
                [ROUTE_PROFILE_VOTING]: {
                    exact: true,
                    path: '/profile/voiting',
                    component: ProfileVotingPage,
                    label: __('My Votings'),
                    icon: 'Icon__voting',
                    roles: [UserRole.REGISTERED, UserRole.ADMIN],
                    isShowImageLine: true,
                },
                [ROUTE_PROFILE_GRANTS]: {
                    exact: true,
                    path: '/profile/grants',
                    component: ProfileGrantsPage,
                    label: __('Grants'),
                    icon: 'Icon__invite',
                    roles: UserRole.WHALE,
                    isShowImageLine: true,
                },
                [ROUTE_PROFILE_INVITED]: {
                    exact: true,
                    path: '/profile/invited-users',
                    component: ProfileInvitedPage,
                    label: __('My Referals'),
                    icon: 'Icon__invite',
                    roles: [UserRole.REGISTERED, UserRole.WHALE, UserRole.GENESIS, UserRole.ADMIN],
                    isShowImageLine: true,
                },
                [ROUTE_PROFILE_CONTESTS]: {
                    exact: true,
                    path: '/profile/contests',
                    component: ProfileContestsPage,
                    label: __('My Contests'),
                    icon: 'Icon__invite',
                    roles: [UserRole.ADMIN],
                    isShowImageLine: true,
                },
            },
        },
        [ROUTE_USER_REDIRECT]: {
            exact: true,
            path: baseUser,
            component: Route,
            componentProps: {
                render: ({match}) => (
                    <Redirect to={`/users/${match.params.address}/donation`}/>
                )
            },
            label: __('Project'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
            rolesUser: UserRole.getAuth(),
        },
        [ROUTE_USER]: {
            path: baseUser,
            component: ProfileLayout,
            label: __('Profile'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
            rolesUser: UserRole.getAuth(),
            items: {
                /*[ROUTE_USER_INBOX]: {
                    exact: true,
                    path: baseUser + '/inbox',
                    component: ProfileInboxPage,
                    label: __('Inbox'),
                    icon: 'Icon__notification',
                    isNavVisible: false,
                    roles: [UserRole.REGISTERED],
                    rolesUser: [UserRole.REGISTERED],
                    isShowImageLine: true,
                },*/
                [ROUTE_USER_DONATION]: {
                    exact: true,
                    path: baseUser + '/donation',
                    component: ProfileDonationPage,
                    label: __('Donation'),
                    icon: 'Icon__rhombus',
                    roles: UserRole.getKeys(),
                    rolesUser: [UserRole.REGISTERED, UserRole.INVITED, UserRole.ANONYMOUS],
                    isShowImageLine: true,
                },
                [ROUTE_USER_PROJECTS]: {
                    exact: true,
                    path: baseUser + '/projects',
                    component: ProfileProjectsPage,
                    label: __('Projects'),
                    icon: 'Icon__rocket',
                    roles: UserRole.getKeys(),
                    rolesUser: [UserRole.REGISTERED],
                    isShowImageLine: true,
                },
                [ROUTE_USER_VOTING]: {
                    exact: true,
                    path: baseUser + '/voiting',
                    component: ProfileVotingPage,
                    label: __('Voting'),
                    icon: 'Icon__voting',
                    roles: UserRole.getKeys(),
                    rolesUser: [UserRole.REGISTERED],
                    isShowImageLine: true,
                },
                [ROUTE_USER_GRANTS]: {
                    exact: true,
                    path: baseUser + '/grants',
                    component: ProfileGrantsPage,
                    label: __('Grants'),
                    icon: 'Icon__invite',
                    roles: UserRole.getKeys(),
                    rolesUser: UserRole.WHALE,
                    isShowImageLine: true,
                },
                [ROUTE_USER_INVITED]: {
                    exact: true,
                    path: baseUser + '/invited-users',
                    component: ProfileInvitedPage,
                    label: __('Invited Users'),
                    icon: 'Icon__invite',
                    roles: UserRole.getKeys(),
                    rolesUser: [UserRole.REGISTERED, UserRole.WHALE, UserRole.GENESIS],
                    isShowImageLine: true,
                },
            },
        },
        [ROUTE_PROJECT_REDIRECT]: {
            exact: true,
            path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)',
            component: Route,
            componentProps: {
                render: ({match}) => (
                    <Redirect to={`/projects/${match.params.uid}/feed`}/>
                )
            },
            label: __('Project'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
        },
        [ROUTE_PROJECT]: {
            path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)',
            component: ProjectLayout,
            label: __('Project'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
            isShowImageLine: true,
            items: {
                [ROUTE_PROJECT_FEED]: {
                    exact: true,
                    path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/feed',
                    component: ProjectFeedPage,
                    label: __('Feed'),
                    icon: 'Icon__feed',
                    // isNavVisible: false,
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
                [ROUTE_PROJECT_DETAILS]: {
                    exact: true,
                    path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/details',
                    component: ProjectDetailsPage,
                    label: __('Details'),
                    icon: 'Icon__details',
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
                [ROUTE_PROJECT_NEWS]: {
                    exact: true,
                    path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/news',
                    component: ProjectNewsPage,
                    label: __('News'),
                    icon: 'Icon__news',
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
            },
        },
        [ROUTE_PROJECTS_REDIRECT]: {
            exact: true,
            path: '/projects',
            component: Redirect,
            componentProps: {
                to: '/projects/featured',
            },
            label: __('Projects'),
            roles: UserRole.getKeys(),
            items: {
                [ROUTE_PROJECTS]: {
                    exact: true,
                    path: '/projects/:state(featured|feed|new|finished)',
                    component: ProjectsPage,
                    label: __('Projects'),
                    isNavVisible: false,
                    roles: UserRole.getKeys(),
                },
            }
        },
        [ROUTE_PROJECT_REDIRECT]: {
            exact: true,
            path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)',
            component: Route,
            componentProps: {
                render: ({match}) => (
                    <Redirect to={`/projects/${match.params.uid}/feed`}/>
                )
            },
            label: __('Project'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
        },
        [ROUTE_PROJECT]: {
            path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)',
            component: ProjectLayout,
            label: __('Project'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
            isShowImageLine: true,
            items: {
                [ROUTE_PROJECT_FEED]: {
                    exact: true,
                    path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/feed',
                    component: ProjectFeedPage,
                    label: __('Feed'),
                    icon: 'Icon__feed',
                    // isNavVisible: false,
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
                [ROUTE_PROJECT_DETAILS]: {
                    exact: true,
                    path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/details',
                    component: ProjectDetailsPage,
                    label: __('Details'),
                    icon: 'Icon__details',
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
                [ROUTE_PROJECT_NEWS]: {
                    exact: true,
                    path: '/projects/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/news',
                    component: ProjectNewsPage,
                    label: __('News'),
                    icon: 'Icon__news',
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
            },
        },

        [ROUTE_CONTESTS_REDIRECT]: {
            exact: true,
            path: '/contests',
            component: Redirect,
            componentProps: {
                to: '/contests/featured',
            },
            label: __('Contests'),
            roles: UserRole.getKeys(),
            items: {
                [ROUTE_CONTESTS]: {
                    exact: true,
                    path: '/contests/:state(featured|new|finished)',
                    component: ContestsPage,
                    label: __('Contests'),
                    isNavVisible: false,
                    roles: UserRole.getKeys(),
                },
            }
        },
        [ROUTE_CONTEST_REDIRECT]: {
            exact: true,
            path: '/contests/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)',
            component: Route,
            componentProps: {
                render: ({match}) => (
                    <Redirect to={`/contests/${match.params.uid}/details`}/>
                )
            },
            label: __('Contest'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
        },
        [ROUTE_CONTEST]: {
            path: '/contests/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)',
            component: ContestLayout,
            label: __('Contest'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
            isShowImageLine: true,
            items: {
                [ROUTE_CONTEST_DETAILS]: {
                    exact: true,
                    path: '/contests/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/details',
                    component: ContestDetailsPage,
                    label: __('Details'),
                    icon: 'Icon__details',
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
                [ROUTE_CONTEST_ENTRIES]: {
                    exact: true,
                    path: '/contests/:uid(\\w+-\\w+-\\w+-\\w+-\\w+)/entries',
                    component: ContestEntriesPage,
                    label: __('Entries'),
                    icon: 'Icon__details',
                    roles: UserRole.getKeys(),
                    isShowImageLine: true,
                },
            },
        },
        [ROUTE_INVOICE]: {
            path: '/invoice/:currency/:address/:amount',
            component: InvoiceLayout,
            label: __('Invoice'),
            isNavVisible: false,
            roles: UserRole.getKeys(),
            isShowImageLine: false,
            items: {}
        }
    },
};
