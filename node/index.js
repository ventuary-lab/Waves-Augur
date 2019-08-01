
// This is backend for contract
const WavesTransport = require('./WavesTransport');
const transport = new WavesTransport({
    dApp: '3P8Fvy1yDwNHvVrabe4ek5b9dAwxFjDKV7R',
});
// const seed = 'estate arrange bitter coast fruit sure ticket giggle concert hurry net wrestle';
const seed = 'whale wash matter sample tent attack question glow grunt pond canoe fence address cancel absent';

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
    console.log(projects);

    Object.keys(projects).map(uid => {
        projects[uid].reveal.forEach(address => {
            if (projects[uid].final.indexOf(address) !== -1) {
                return;
            }

            console.log(uid, projects[uid].status, address); // eslint-disable-line no-console
            transport.nodePublishBySeed('finalizevoting', [uid, address], null, seed).catch(console.error);
            transport.nodePublishBySeed('closeexpiredvoting', [uid, address], null, seed).catch(console.error);
            transport.nodePublishBySeed('claimwinnings', [uid, address], null, seed).catch(console.error);
        });
    });

    setTimeout(checker, 60 * 1000); // 1 m
};
checker();
