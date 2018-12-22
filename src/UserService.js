import PubSub from 'pubsub-js';
import * as actions from './store/dmarket/actions';
import { store } from './store'
import { Connect } from 'uport-connect';
import Web3 from 'web3';

const FILE_MANAGER_ADDRESS = '';

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
    //uport.logout();
    console.log('loadProducts');
    const products = [
        {
            seller: '0xf56eEBd4A787Ab0FBa4fEd65a3A4ed77CB330A9B',
            title: 'Foundations of Python Network Programming',
            description: 'Eliminate roadblocks to learn programming: Start writing your own programs in Python 3 from scratch',
            author: 'John Doe and Mary Kate',
            coverImage: 'https://ipfs.io/ipfs/Qmcg5aRcoaw21GYG2PQ1cSkX3oFrDMmscs5U7FaNptwa5Q',
            localPrice: 10.00,
            currency: 'USD',
            ether: 0.00,
            id: '0xa5b9d60f32436310afebcfda832817a68921beb782fabf7915cc0460b443116a'
        }
    ];
    store.dispatch(actions.loadProducts(products));
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