const _orderBy = require('lodash/orderBy');

const ContractApp = require('./ContractApp');
const ProjectFilter = require('./enums/ProjectFilter');

module.exports = async (app) => {
    const contract = new ContractApp({
        nodeUrl: 'https://testnodes.wavesnodes.com',
        dApp: '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF',
    });

    const routes = {
        '/api/v1/contests': async (request, userAddress) => {
            return contract.collections.contests.getContests(userAddress);
        },
        '/api/v1/contests/:uid': async (request, userAddress) => {
            return contract.collections.contests.getContest(request.params.uid, userAddress);
        },
        '/api/v1/contests/:uid/projects': async (request, userAddress) => {
            const projects = await contract.collections.projects.getProjects(request.params.filter, userAddress);
            return projects.filter(project => project.contest && project.contest === request.params.uid);
        },
        [`/api/v1/projects/:filter(${ProjectFilter.getKeys().join('|')})?`]: async (request, userAddress) => {
            return contract.collections.projects.getProjects(request.params.filter, userAddress);
        },
        '/api/v1/projects/inbox/:address': async (request, userAddress) => {
            return contract.collections.projects.getInboxProjects(request.params.address, userAddress);
        },
        '/api/v1/projects/author/:address': async (request, userAddress) => {
            return contract.collections.projects.getAuthorProjects(request.params.address, userAddress);
        },
        '/api/v1/projects/:uid': async (request, userAddress) => {
            return contract.collections.projects.getProject(request.params.uid, userAddress);
        },
        '/api/v1/reviews': async (request, userAddress) => {
            let items = []
                .concat(await contract.collections.reviewDonations.getDonations(userAddress))
                .concat(await contract.collections.reviewVotings.getVotings(userAddress))
                .concat(await contract.collections.reviewWhales.getWhales(userAddress));
            items = _orderBy(items, 'review.createTime', 'desc');
            return items;
        },
        '/api/v1/reviews/donations': async (request, userAddress) => {
            return contract.collections.reviewDonations.getDonations(userAddress);
        },
        '/api/v1/reviews/donations/user/:address': async (request, userAddress) => {
            return contract.collections.reviewDonations.getUserDonations(request.params.address, userAddress);
        },
        '/api/v1/reviews/votings': async (request, userAddress) => {
            return contract.collections.reviewVotings.getVotings(userAddress);
        },
        '/api/v1/reviews/votings/user/:address': async (request, userAddress) => {
            return contract.collections.reviewVotings.getUserVotings(request.params.address, userAddress);
        },
        '/api/v1/reviews/whales': async (request, userAddress) => {
            return contract.collections.reviewWhales.getWhales(userAddress);
        },
        '/api/v1/reviews/whales/user/:address': async (request, userAddress) => {
            return contract.collections.reviewWhales.getUserWhales(request.params.address, userAddress);
        },
        '/api/v1/users': async (request, userAddress) => {
            return contract.collections.users.getUsers(userAddress);
        },
        '/api': async () => {
            return {
                version: 'v1',
                methods: Object.keys(routes),
            };
        },
    };
    Object.keys(routes).forEach(url => {
        app.get(url, async (request, response) => {
            const userAddress = request.headers['x-user-address'] || null;
            try {
                const result = await routes[url](request, userAddress);
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(JSON.stringify(result));
            } catch(e) {
                contract.logger.error(e);
                response.writeHead(500, {'Content-Type': 'text/html'});
                response.end({
                    error: String(e),
                });
            }
        });
    });

    await contract.start();
};
