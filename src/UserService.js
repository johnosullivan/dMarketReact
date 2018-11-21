import PubSub from 'pubsub-js';
import * as actions from './store/dmarket/actions';

import { getCurrentStore } from './store'

var login = function (msg, data) {
    console.log('PubSub');
    console.log( msg, data );
    getCurrentStore().dispatch(actions.loadAuthSuccess());
};

export default class Service {

    constructor() {
        console.log('UserService');
        this.loginSubscribe = PubSub.subscribe('UPORT_LOGIN', login);
    }
}