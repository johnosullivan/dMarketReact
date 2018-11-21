import PubSub from 'pubsub-js';
import * as actions from './store/dmarket/actions';
import { store } from './store'
import { Connect } from 'uport-connect';
import Web3 from 'web3';

const uport = new Connect('dMarket', {
    network: 'rinkeby'
});

const provider = uport.getProvider();
const web3 = new Web3(provider);

const login = function(msg, data) {
    uport.requestDisclosure({
      requested: ['name', 'avatar', 'phone', 'country'],
      notifications: true
    })
    uport.onResponse('disclosureReq').then(payload => {
      store.dispatch(actions.loadAuthSuccess(payload.payload));
    });
};

const logout = function(msg, data) {
    uport.logout();
    store.dispatch(actions.loadLogOutSuccess());
}

const sendEth = function (msg, data) {
    
    const statusContractABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "x",
                    "type": "string"
                }
            ],
            "name": "set",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "get",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
  
    const statusContract = uport.contract(statusContractABI).at("0xeef43eb4c6604ec1fc53c3cc818568740da2d30c")
    const reqId = 'updateStatus'
    statusContract.set('0xeef43eb4c6604ec1fc53c3cc818568740da2d30c', reqId)
  
    uport.onResponse(reqId).then(res => {
      const txId = res.payload
      console.log(res);
    })

}

export default class Service {

    constructor() {
        this.loginSubscribe = PubSub.subscribe('UPORT_LOGIN', login);
        this.logoutSubscribe = PubSub.subscribe('UPORT_LOGOUT', logout);
    }
}