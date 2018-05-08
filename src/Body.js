import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Label,Advertisement,Form,TextArea,Message,Table,Card, Icon, Search, Input, Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment, Button } from 'semantic-ui-react';

import AddProduct from './AddProduct';

const Home = () => (
  <div>
    <Container style={{ padding: '5em 0em' }} text>

    </Container>
  </div>
)

const Roster = () => (
  <div>

  </div>
)

const Schedule = () => (
  <div>

  </div>
)

const Products = () => (
  <div>

  </div>
)

const Body = () => (
    <Container text style={{ marginTop: '5em' }}>
    <Switch>
      <Route exact path='/' component={AddProduct}/>
      <Route path='/search' component={Roster}/>
      <Route path='/myproducts' component={Products}/>
      <Route path='/myorders' component={Schedule}/>
    </Switch>
    </Container>
)

export default Body
