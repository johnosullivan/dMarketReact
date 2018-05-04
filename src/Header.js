import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import { Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment } from 'semantic-ui-react';
// The Header creates links that can be used to navigate
// between routes.
const JSXHeader = () => (
  <div>
  <Menu fixed='top' inverted color="teal">
        <Menu.Item as={Link} to='/' content="Home"/>
        <Menu.Item as={Link} to='/search' content="Search"/>
        <Menu.Item as={Link} to='/myorders' content="My Orders"/>
  </Menu>
  </div>
)

export default JSXHeader
