import React from 'react';
import { Link } from 'react-router-dom';
import { Icon,Search ,Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment,Input } from 'semantic-ui-react';

const DMHeader = () => (
  <div>
    <Menu fixed='top' inverted color="blue">
        <Menu.Item as={Link} to='/' content="Home"/>
        <Menu.Item as={Link} to='/search' content="Search"/>
        <Menu.Item as={Link} to='/myproducts' content="My Products"/>
        <Menu.Item as={Link} to='/myorders' content="My Orders"/>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Search size="small" loading={false} {...this.props} />
          </Menu.Item>
          <Menu.Item>
            <Icon name='bars'/>
          </Menu.Item>
          <Menu.Item>
             <Icon name='shopping cart'/>
          </Menu.Item>
        </Menu.Menu>
    </Menu>
  </div>
)

export default DMHeader
