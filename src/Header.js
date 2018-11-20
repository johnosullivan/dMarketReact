import React from 'react';
import { 
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  bootstrapUtils
} from 'react-bootstrap';

import uport from './uport.svg';

const Header = () => (
  <div>
    <style type="text/css">
      {`
    .btn-custom {
        background-color: rgb(92, 80, 202);
        color: white;
    }
    `}
    </style>
    <Navbar bg="light" expand="lg">
    <Navbar.Brand href="">dMarket</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="">Home</Nav.Link>
        <Nav.Link href="">About</Nav.Link>
      </Nav>
      <Button variant="custom">
        <img src={uport}/>
      </Button>
    </Navbar.Collapse>
    </Navbar>
  </div>
)
export default Header;
