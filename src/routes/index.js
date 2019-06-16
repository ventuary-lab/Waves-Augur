import IndexPage from './IndexPage';
import AboutPage from './AboutPage';
import NewsPage from './NewsPage';
import TestPage from './TestPage';
import CommunityPage from './CommunityPage';
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
            id: RoutesEnum.NEWS,
            exact: true,
            isVisible: true,
            path: '/news',
            component: NewsPage,
            label: RoutesEnum.NEWS,
            title: RoutesEnum.getLabel(RoutesEnum.NEWS),
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
    ],
};
