import React from 'react';

import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import uport from './uport.svg';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Header extends React.Component {

  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  };

  constructor(props) {
    super(props);


  }

  login = () => {
    //PubSub.publish('UPORT_LOGIN', Date());

    const toggleMenuTrigger = function (msg, data) {
      console.log(msg, data);
    };  
    this.toggleMenu = PubSub.subscribe('MENU', toggleMenuTrigger);
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    console.log(this.state);

    const style = {
      outline: 'none'
    };

    return (
      <div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    isAuth: state.dmarket.isAuth,
    account: state.dmarket.uPortAccount
  }
}
export default connect(mapStateToProps)(Header)
