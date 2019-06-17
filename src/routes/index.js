import IndexPage from './IndexPage';
import AboutPage from './AboutPage';
import NewsPage from './NewsPage';
import TestPage from './TestPage';
import CommunityPage from './CommunityPage';
import CampaignsPage from './CampaignsPage';
import ProfilePage from './ProfilePage';
import InboxPage from './InboxPage';
import RoutesEnum from '../enums/RoutesEnum';

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
            component: ProfilePage,
            label: RoutesEnum.PROFILE,
            title: RoutesEnum.getLabel(RoutesEnum.PROFILE),
        },
        {
            id: RoutesEnum.INBOX,
            exact: true,
            isVisible: true,
            path: '/inbox',
            component: InboxPage,
            label: RoutesEnum.INBOX,
            title: RoutesEnum.getLabel(RoutesEnum.INBOX),
        },
    ],
};
