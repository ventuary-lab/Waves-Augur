import IndexPage from './IndexPage';
import AboutPage from './AboutPage';
import NewsPage from './NewsPage';
import CommunityPage from './CommunityPage';
import UserRole from 'enums/UserRole';

export default {
    label: __('Главная'),
    exact: true,
    path: '/',
    component: IndexPage,
    roles: UserRole.getKeys(),
    items: {
        catalog: {
            label: __('О проекте'),
            exact: true,
            path: '/about',
            component: AboutPage,
            roles: UserRole.getKeys()
        },
        news: {
            label: __('Новости'),
            exact: true,
            path: '/news',
            component: NewsPage,
            roles: UserRole.getKeys()
        },
        community: {
            label: __('Сообщество'),
            exact: true,
            path: '/community',
            component: CommunityPage,
            roles: UserRole.getKeys()
        },
    }
};
