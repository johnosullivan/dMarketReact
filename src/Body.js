import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react';
//import AddProduct from './AddProduct';
import { 
  Navbar,
  Nav,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';


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
    

      <Button variant="uport" onClick={() => {
          PubSub.publish('UPORT_LOGOUT', Date())
        }}> 
        UPORT_LOGOUT        
      </Button>

    </Container>
)

export default Body
