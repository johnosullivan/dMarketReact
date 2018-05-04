import React, { Component } from 'react';
import logo from './logo.svg';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Body/>
        <Footer/>
      </div>
    );
  }
}

export default App;
