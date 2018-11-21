import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';

import { Connect } from 'uport-connect';

import './App.css';

import {
  UserService
} from './UserService'; 

const service = new UserService();

class App extends Component {

  constructor() {
    super();

    console.log(service);
    console.log(window.ethereum);

    window.ethereum.enable();

    /*
    const uport = new Connect('dMarket', {network: 'ropsten'});

    uport.requestDisclosure({
      requested: ['name', 'avatar', 'phone', 'country'],
      notifications: true
    })
    uport.onResponse('disclosureReq').then(payload => {
      console.log(payload);
    });
    */
  }

  render() {
    console.log(this.props);
    return (
      <div className="App">
      
        <Header store={this.props.store}/>
        <Body/>
      </div>
    );
  }
}

export default App;
