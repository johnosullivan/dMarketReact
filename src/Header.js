import React from 'react';

import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import uport from './uport.svg';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  login = () => {
    //PubSub.publish('UPORT_LOGIN', Date());
  };

/*
<Navbar bg="light" expand="lg">
  <Navbar.Brand href="">dMarket</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">

    </Nav>
    { !this.props.isAuth &&
      <div>
        <Button variant="primary" onClick={this.login}>
          Login
        </Button>
      </div>
    }
    { this.props.isAuth &&
      <div>
        <Row>
          <Col>
            <img src={this.props.account.avatar.uri} style={{
              width: 40,
              height: 40,
              borderRadius: 20
            }}/>
          </Col>
        </Row>
      </div>
    }
  </Navbar.Collapse>
</Navbar>
*/


  render() {
    console.log(this.props);
    return (
      <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu">
            <MenuIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
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
