import React, { Component } from 'react';
import logo from './logo.svg';
import DMHeader from './Header';
import DMBody from './Body';
import Footer from './Footer';

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

import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {

  constructor() {
    super();
    console.log(window.web3);
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
