import {nodeInteraction} from '@waves/waves-transactions';

const dummyTestUsers = [
    {
        address: '3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv',
        seed: 'invited1 broom nut fun weekend task library twice faint wish state camp',
        data: {role: 'invited', name: 'Loly Best', ref: 'Genesis Jedi'}
    },
    {
        address: '3N9FwayDdXjyV6EcRo3Tnj7cxbNihXcqBv2',
        seed: 'invited2 broom nut fun weekend task library twice faint wish state camp',
        data: {role: 'registered', name: 'Tomy Wane', ref: 'Genesis Jedi'}
    },
    {
        address: '3N6jbdiSihz6dHXsV5jDCCSTkRNXuAQDiHn',
        seed: 'invited3 broom nut fun weekend task library twice faint wish state camp',
        data: {role: 'whale', name: 'Waves Labs', ref: 'Genesis Jedi'}
    }
];
const dummyKeeperState = {
    account: {
        address: '3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv'
    }
};
const _social = {
    url_twitter: 'https://twitter.com/AlekseiPupyshev',
    url_telegram: 'https://t.me/adventuary'
};
const dummyUser = {
    address: '3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv',
    ref: '3Mtzmtfh13ihJ3nJyyxT9zUvZRUKmNVDMa5',
    name: 'Aleksei Pupyshev',
    title: 'DLT Evangelist',
    activity: '150',
    avatar: 'https://pp.userapi.com/c848520/v848520954/bd19d/eQJ5RP-ilpg.jpg',
    social: _social,
    status: 'registered',
    location: ''
};
const dummyInvitedUser = {
    address: '3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv',
    ref: '3Mtzmtfh13ihJ3nJyyxT9zUvZRUKmNVDMa5',
    name: 'Aleksei Pupyshev',
    title: '',
    activity: '0',
    avatar: '',
    social: '',
    status: 'invited',
    location: ''
};
const dummyUserCollection = [
    dummyUser, dummyUser, dummyUser, dummyInvitedUser, dummyInvitedUser, dummyInvitedUser
];


export default class DalComponent {

    constructor() {
        this.nodeUrl = process.env.APP_NODE_URL || 'https://testnodes.wavesnodes.com';
        this.keeper = window.WavesKeeper || {};

        this._collectionEvents = [];
        this._collectionVotes = [];
        this._collectionDonations = [];
        this._collectionUsers = dummyUserCollection;
        this._collectionProjects = [];
    }

    async getCheckStatusInvitedUser(state) {
        return Promise.resolve(dummyTestUsers[0].address === state.account.address);
    }

    async getCheckStatusWhaleUser(state) {
        return Promise.resolve(dummyTestUsers[2].address === state.account.address);
    }

    async getCollectionInvitedUsers(address) {
        return Promise.resolve(this._collectionUsers.filter((x) => x.ref === address));
    }

    async getCollectionAllUsers() {
        return Promise.resolve(this._collectionUsers.filter((x) => x.status === 'registered'));
    }

    async setInviteUser(user) {
        this._collectionUsers.push(user);
        return Promise.resolve({type: 16}); // invoke tx for WavesKeeper
    }

    async setUserRegisterOrUpdate(user) {
        return Promise.resolve({ // invoke tx for WavesKeeper
            type: 16,
            data: {
                fee: {
                    assetId: 'WAVES',
                    tokens: '0.009'
                },
                dApp: '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF',
                call: {
                    args: [
                        {type: 'string', value: JSON.stringify(user)},
                        {type: 'string', value: ''}
                    ],
                    function: 'signup'
                },
                payment: []
            }
        });
    }

    async auth() {
        const userData = await this.keeper.publicState();
        const address = userData.account.address;

        let dapp = '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF';
        let bio = await nodeInteraction.accountDataByKey('wl_bio_' + address, dapp, this.nodeUrl);
        let status = await nodeInteraction.accountDataByKey('wl_sts_' + address, dapp, this.nodeUrl);

        return {
            address: address,
            bio: JSON.parse(bio.value),
            status: status.value,
        };
    }

}
