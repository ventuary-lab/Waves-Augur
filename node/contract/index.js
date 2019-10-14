const _orderBy = require('lodash/orderBy');

const ContractApp = require('./ContractApp');
const ProjectFilter = require('./enums/ProjectFilter');
const ContestFilter = require('./enums/ContestFilter');
const ResponseController = require('./controllers/ResponseController');
const TelegramBotClient = require('../services/telegram-bot');

module.exports = async (app, httpServer) => {
    const contract = new ContractApp({
        nodeUrl: process.env.APP_DAPP_NETWORK === 'main' ? 'https://nodes.wavesplatform.com' : (
            process.env.NODE_URL  || 'https://testnodes.wavesnodes.com'
        ),
        dApp: process.env.DAPP || '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF',
        httpServer,
        logger: {
            level: 'debug'
        }
    });

    const telegramBot = new TelegramBotClient();

    const routes = {
        '/api/v1/init': async () => {
            return {
                config: {
                    dal: {
                        dAppNetwork: process.env.APP_DAPP_NETWORK || 'test',
                        dApp: process.env.DAPP || '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF', // testnet
                        adminAdress: process.env.APP_ADMIN_ADDRESS || '3MwMR1ZFfy712trHVLisizYmvRQwsg8z9Bn',
                    }
                },
            };
        },
        [`/api/v1/contests/:filter(${ContestFilter.getKeys().join('|')})?`]: async (request) => {
            return contract.collections.contests.getContests(request.params.filter);
        },
        '/api/v1/contests/:uid': async (request) => {
            return contract.collections.contests.getContest(request.params.uid);
        },
        '/api/v1/contests/:uid/projects': async (request) => {
            let projects = await contract.collections.projects.getProjects();
            return projects.filter(project => project.contest && project.contest === request.params.uid);
        },
        [`/api/v1/projects/:filter(${ProjectFilter.getKeys().join('|')})?`]: async (request) => {
            let projects = await contract.collections.projects.getProjects(request.params.filter);

            return ResponseController.getSlicedEntities(request, projects);
        },
        '/api/v1/projects/author/:address': async (request) => {
            return contract.collections.projects.getAuthorProjects(request.params.address);
        },
        '/api/v1/projects/:uid': async (request) => {
            return contract.collections.projects.getProject(request.params.uid);
        },
        // '/api/v1/projects/:uid/feed': async (request) => {
        //     let items = []
        //         .concat(await contract.collections.reviewDonations.getProjectDonations(request.params.uid))
        //         .concat(await contract.collections.reviewWhales.getProjectWhales(request.params.uid));
        //     items = _orderBy(items, 'review.createTime', 'desc');
        //     return items;
        // },
        '/api/v1/reviews': async () => {
            let items = []
                .concat(await contract.collections.reviewDonations.getDonations())
                .concat(await contract.collections.reviewVotings.getVotings())
                .concat(await contract.collections.reviewWhales.getWhales());
            items = _orderBy(items, 'review.createTime', 'desc');
            return items;
        },
        '/api/v1/reviews/donations': async (request) => {
            const donations = await contract.collections.reviewDonations.getDonations();
            return ResponseController.getSlicedEntities(request, donations);
        },
        '/api/v1/reviews/donations/user/:address': async (request) => {
            return contract.collections.reviewDonations.getUserDonations(request.params.address);
        },
        '/api/v1/reviews/donations/project/:uid': async (request) => {
            return contract.collections.reviewDonations.getProjectDonations(request.params.uid);
        },
        '/api/v1/reviews/donations/:id': async (request) => {
            const reviews = await contract.collections.reviewDonations.getDonations();
            const review = reviews.find(review => review.id.replace('text_id:', '') === request.params.id);
            return review || null;
        },
        '/api/v1/reviews/votings': async () => {
            return contract.collections.reviewVotings.getVotings();
        },
        '/api/v1/reviews/votings/user/:address': async (request) => {
            return contract.collections.reviewVotings.getUserVotings(request.params.address);
        },
        '/api/v1/reviews/votings/:id': async (request) => {
            const reviews = await contract.collections.reviewVotings.getVotings();
            const review = reviews.find(review => review.id === request.params.id);
            return review || null;
        },
        '/api/v1/reviews/whales': async () => {
            return contract.collections.reviewWhales.getWhales();
        },
        '/api/v1/reviews/whales/user/:address': async (request) => {
            return contract.collections.reviewWhales.getUserWhales(request.params.address);
        },
        '/api/v1/reviews/whales/project/:uid': async (request) => {
            return contract.collections.reviewWhales.getProjectWhales(request.params.uid);
        },
        '/api/v1/reviews/whales/:id': async (request) => {
            const reviews = await contract.collections.reviewVotings.getWhales();
            const review = reviews.find(review => review.id === request.params.id);
            return review || null;
        },
        '/api/v1/users': async () => {
            return contract.collections.users.getUsers();
        },
        '/api/v1/users/:address': async (request) => {
            return contract.collections.users.getUser(request.params.address);
        },
        '/api/v1/users/:address/invites': async (request) => {
            return contract.collections.users.getUserInvites(request.params.address);
        },
        ...telegramBot.getRoutes(),
        '/api/*': async () => {
            return {
                version: 'v1',
                methods: Object.keys(routes),
            };
        },
    };
    Object.keys(routes).forEach(url => {
        app.get(url, async (request, response) => {
            let content = {};
            try {
                content = await routes[url](request);
            } catch(e) {
                contract.logger.error(e, e.stack);
                content = {
                    error: String(e),
                };
            }

            response.writeHead(content && content.error ? 500 : 200, {'Content-Type': 'text/html'});
            response.end(JSON.stringify(content));
        });
    });

    await contract.start();
};
