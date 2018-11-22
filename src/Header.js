import React from 'react';
import { 
  Navbar,
  Nav,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';

import uport from './uport.svg';

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  login = () => {
    PubSub.publish('UPORT_LOGIN', Date());
  };

  render() {
    console.log(this.props);
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
