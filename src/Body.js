import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Search, Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment, Button } from 'semantic-ui-react';

const Home = () => (
  <div>

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

const Body = () => (
  <main>
    <Container text style={{ marginTop: '4em' }}>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/search' component={Roster}/>
      <Route path='/myorders' component={Schedule}/>
    </Switch>
    </Container>
  </main>
)

export default Body
