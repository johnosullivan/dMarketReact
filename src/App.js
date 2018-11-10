import React, { Component } from 'react';
import DMHeader from './Header';
import DMBody from './Body';

import { Connect } from 'uport-connect';
//
//import logo from './logo.svg';
//import Footer from './Footer';

/*
import {
  Button,
  Icon,
  Modal,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Input
} from 'semantic-ui-react';
*/

import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {

  constructor() {
    super();
    console.log(window.web3);

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
