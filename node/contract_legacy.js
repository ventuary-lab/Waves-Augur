// This is backend for contract
const WavesTransport = require('./WavesTransport');
const transport = new WavesTransport({
    dApp: process.env.DAPP,
});
// const seed = 'estate arrange bitter coast fruit sure ticket giggle concert hurry net wrestle';
const seed = process.env.ORACLE_SEED;

const checker = async () => {
    const regexp = /(status|reveal|final)_(.{36})(_(.+))?/;
    const data = await transport.nodeFetchPattern(regexp);
    const projects = {};
    Object.keys(data).map(key => {
        const matches = regexp.exec(key);
        projects[matches[2]] = projects[matches[2]] || {
            status: null,
            reveal: [],
            final: [],
        };
        if (matches[4]) {
            projects[matches[2]][matches[1]].push(matches[4]); // Store reveal address
        } else {
            projects[matches[2]][matches[1]] = data[key];
        }
    });

    const requests = [];
    Object.keys(projects).map(uid => {
        projects[uid].reveal.map(address => {
            requests.push([uid, address]);
        });
    });

    next(requests, 0, () => setTimeout(checker, 60 * 1000));
};
checker();

const next = async (requests, index, callback) => {
    if (!requests[index]) {
        callback();
        return;
    }

    console.log('REQUEST:', requests[index]); // eslint-disable-line no-console
    try {
        // await transport.nodePublishBySeed('finalizevoting', requests[index], null, seed);
        // await transport.nodePublishBySeed('closeexpiredvoting', requests[index], null, seed);
        await transport.nodePublishBySeed('claimwinnings', requests[index], null, seed);
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
    }

    next(requests, index + 1, callback);
};
