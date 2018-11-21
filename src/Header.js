import React from 'react';
import { 
  Navbar,
  Nav,
  Button,
  Grid,
  Row,
  Col,
  Image,
  Dropdown,
  MenuItem
} from 'react-bootstrap';

import * as actions from './store/dmarket/actions';

import uport from './uport.svg';

import { connect } from 'react-redux';

import PubSub from 'pubsub-js';

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  login = () => {
    PubSub.publish('UPORT_LOGIN', 'hello world!');
    //this.props.store.dispatch(actions.loadAuthSuccess())
  };

  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="">dMarket</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="">Home</Nav.Link>
              <Nav.Link href="">About</Nav.Link>
            </Nav>
            { !this.props.isAuth &&
              <div>
                <Button variant="uport" onClick={this.login}> 
                  <img src={uport}/>
                </Button>
              </div>
            }
            { this.props.isAuth &&
              <div>
                <Row>
                  <Col>
                    <img src="https://ipfs.infura.io/ipfs/QmcCCfuXWswSKt7ULnF19ATuoUt1cC5yUNgf4LFL8pQyTq" style={{
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
    </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    isAuth: state.dmarket.isAuth
  }
}
export default connect(mapStateToProps)(Header)
