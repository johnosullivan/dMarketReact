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

import uport from './uport.svg';

export default class Header extends React.Component {

  state = {
    isAuth: false
  }

  constructor() {
    super();
  }

  login = () => {
    this.setState({ isAuth: true });
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
            { !this.state.isAuth &&
              <div>
                <Button variant="custom" onClick={this.login}> 
                  <img src={uport}/>
                </Button>
              </div>
            }
            { this.state.isAuth &&
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
