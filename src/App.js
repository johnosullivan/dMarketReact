import React, { Component } from 'react';
import DMHeader from './Header';
import DMBody from './Body';

import { Connect } from 'uport-connect';

import './App.css';

class App extends Component {

  constructor() {
    super();
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

    return (
      <div className="App">
        <DMHeader/>
        <DMBody/>
      </div>
    );
  }
}

export default App;
