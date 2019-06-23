
let dummyTestUsers = [
    {address: '3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv', seed: 'invited1 broom nut fun weekend task library twice faint wish state camp', 
      data: {role: "invited", name: "Loly Best", ref: "Genesis Jedi"}},
    {address: '3N9FwayDdXjyV6EcRo3Tnj7cxbNihXcqBv2', seed: 'invited2 broom nut fun weekend task library twice faint wish state camp', 
      data: {role: "registered", name: "Tomy Wane", ref: "Genesis Jedi"}},
    {address: '3N6jbdiSihz6dHXsV5jDCCSTkRNXuAQDiHn', seed: 'invited3 broom nut fun weekend task library twice faint wish state camp', 
      data: {role: "whale", name: "Waves Labs", ref: "Genesis Jedi"}}
]

let dummyKeeperState = {
    account: {
        address: '3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv'
    }
}
  
let _social = { 
    url_twitter: "https://twitter.com/AlekseiPupyshev", 
    url_telegram: "https://t.me/adventuary"
}

let dummyUser = {
    address: "3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv",
    ref: "3Mtzmtfh13ihJ3nJyyxT9zUvZRUKmNVDMa5",
    name: "Aleksei Pupyshev",
    title: "DLT Evangelist",
    activity: "150",
    avatar: "https://pp.userapi.com/c848520/v848520954/bd19d/eQJ5RP-ilpg.jpg",
    social: _social,
    status: "registered",
    location: ""
}
  
  let dummyInvitedUser = {
    address: "3N16c6myJsnmdHVXWS9NmXYBDUdVgb2Dgvv",
    ref: "3Mtzmtfh13ihJ3nJyyxT9zUvZRUKmNVDMa5",
    name: "Aleksei Pupyshev",
    title: "",
    activity: "0",
    avatar: "",
    social: "",
    status: "invited",
    location: ""
  }
  
  
  let dummyUserCollection = [
    dummyUser, dummyUser, dummyUser, dummyInvitedUser, dummyInvitedUser, dummyInvitedUser
  ]
  
  let getCheckStatusInvitedUser = function(state) {
    return new Promise((resolve) => {
      resolve(dummyTestUsers[0].address == state.account.address)
    });
  }
  let getCheckStatusRegisteredUser = function(state) {
    return new Promise((resolve) => {
      resolve(dummyTestUsers[1].address == state.account.address)
    });
  }
  let getCheckStatusWhaleUser = function(state) {
    return new Promise((resolve) => {
      resolve(dummyTestUsers[2].address == state.account.address)
    });
  }
  
  let getCollectionInvitedUsers = function(address) {
    let dal = this
    return new Promise((resolve) => {
      resolve(dal._collectionUsers.filter((x) => x.ref == address))
    });
  }
  
  let getCollectionAllUsers = function() {
    return new Promise((resolve) => {
      resolve(dal._collectionUsers.filter((x) => x.status == "registered"))
    });
  }
  
  let setInviteUser = function(userdata) {
    let dal = this
    dal._collectionUsers.push(userdata)
    return new Promise((resolve) => {
      resolve({type: 16}) // invoke tx for WavesKeeper
    });
  }
  
  let setUserRegisterOrUpdate = function(userdata) {
    let transaction = {
      type: 16,
      data: {
        fee: {
          assetId: "WAVES",
          tokens: "0.009"
        },
        dApp: "3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF",
        call: {
          args: [
            {type: "string", value: JSON.stringify(userdata)},
            {type: "string", value: "" }
          ],
          function: "signup"
        },
        payment: []
      }
    }
    return new Promise((resolve) => {
      resolve(transaction) // invoke tx for WavesKeeper
    });
  }
  
const DAL = {
    _collectionEvents: [],
    _collectionVotes: [],
    _collectionDonations: [],
    _collectionUsers: dummyUserCollection,
    _collectionProjects: [],
    getCheckStatusInvitedUser: getCheckStatusInvitedUser,
    getCheckStatusRegisteredUser: getCheckStatusRegisteredUser,
    getCheckStatusWhaleUser: getCheckStatusWhaleUser,
    getCollectionInvitedUsers: getCollectionInvitedUsers.bind(this),
    getCollectionAllUsers: getCollectionAllUsers,
    getCollectionEvents: "",
    getCollectionDonations: "",
    getCollectionVotes: "",
    setInviteUser: setInviteUser,
    setUserRegisterOrUpdate: setUserRegisterOrUpdate,
    setProfileRegisterOrUpdate: ""
}

export default DAL;