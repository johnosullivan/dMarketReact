import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react';
//import AddProduct from './AddProduct';

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
//<Route exact path='/' component={AddProduct}/>
const Body = () => (
    <Container text style={{ marginTop: '5em', marginBottom: '2em' }}>
    <Switch>
      <Route path='/search' component={Roster}/>
      <Route path='/myproducts' component={Products}/>
      <Route path='/myorders' component={Schedule}/>
    </Switch>
    </Container>
)

export default Body
