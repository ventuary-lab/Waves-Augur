import {Redirect} from 'react-router';

import RoutesEnum from '../enums/RoutesEnum';
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


export default {
    id: RoutesEnum.MAIN,
    exact: true,
    isVisible: true,
    path: '/',
    component: IndexPage,
    label: RoutesEnum.MAIN,
    title: RoutesEnum.getLabel(RoutesEnum.MAIN),
    items: [
        {
            id: RoutesEnum.ABOUT,
            exact: true,
            isVisible: true,
            path: '/about',
            component: AboutPage,
            label: RoutesEnum.ABOUT,
            title: RoutesEnum.getLabel(RoutesEnum.ABOUT),
        },
        {
            id: RoutesEnum.CAMPAIGNS,
            exact: true,
            isVisible: true,
            path: '/campaigns',
            component: CampaignsPage,
            label: RoutesEnum.CAMPAIGNS,
            title: RoutesEnum.getLabel(RoutesEnum.CAMPAIGNS),
        },
        {
            id: RoutesEnum.COMMUNITY,
            exact: true,
            isVisible: true,
            path: '/community',
            component: CommunityPage,
            label: RoutesEnum.COMMUNITY,
            title: RoutesEnum.getLabel(RoutesEnum.COMMUNITY),
        },
        {
            id: RoutesEnum.TEST,
            exact: true,
            isVisible: true,
            path: '/test',
            component: TestPage,
            label: RoutesEnum.TEST,
            title: RoutesEnum.getLabel(RoutesEnum.TEST),
        },
        {
            id: RoutesEnum.FEED,
            exact: true,
            isVisible: true,
            path: '/feed',
            component: NewsPage,
            label: RoutesEnum.FEED,
            title: RoutesEnum.getLabel(RoutesEnum.FEED),
        },
        {
            id: RoutesEnum.PROFILE,
            exact: true,
            isVisible: true,
            path: '/profile',
            component: Redirect,
            componentProps: {
                to: '/profile/projects',
            },
            label: RoutesEnum.PROFILE,
            title: RoutesEnum.getLabel(RoutesEnum.PROFILE),
            items: [
                {
                    id: RoutesEnum.PROFILE_INBOX,
                    exact: true,
                    isVisible: true,
                    path: '/profile/inbox',
                    component: ProfileInboxPage,
                    label: RoutesEnum.PROFILE_INBOX,
                    title: RoutesEnum.getLabel(RoutesEnum.PROFILE_INBOX),
                    icon: 'Icon__notification'
                },
                {
                    id: RoutesEnum.PROFILE_DONATION,
                    exact: true,
                    isVisible: true,
                    path: '/profile/donation',
                    component: ProfileDonationPage,
                    label: RoutesEnum.PROFILE_DONATION,
                    title: RoutesEnum.getLabel(RoutesEnum.PROFILE_DONATION),
                    icon: 'Icon__rhombus'
                },
                {
                    id: RoutesEnum.PROFILE_PROJECTS,
                    exact: true,
                    isVisible: true,
                    path: '/profile/projects',
                    component: ProfileProjectsPage,
                    label: RoutesEnum.PROFILE_PROJECTS,
                    title: RoutesEnum.getLabel(RoutesEnum.PROFILE_PROJECTS),
                    icon: 'Icon__rocket'
                },
                {
                    id: RoutesEnum.PROFILE_VOTING,
                    exact: true,
                    isVisible: true,
                    path: '/profile/voiting',
                    component: ProfileVotingPage,
                    label: RoutesEnum.PROFILE_VOTING,
                    title: RoutesEnum.getLabel(RoutesEnum.PROFILE_VOTING),
                    icon: 'Icon__voting'
                },
                {
                    id: RoutesEnum.PROFILE_INVITED,
                    exact: true,
                    isVisible: true,
                    path: '/profile/invited-users',
                    component: ProfileInvitedPage,
                    label: RoutesEnum.PROFILE_INVITED,
                    title: RoutesEnum.getLabel(RoutesEnum.PROFILE_INVITED),
                    icon: 'Icon__invite'
                },
            ],
        },
    ],
};
