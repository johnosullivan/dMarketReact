import React from 'react'
import { Container } from 'semantic-ui-react';
//import AddProduct from './AddProduct';
import { 
  Button
} from 'react-bootstrap';
import PubSub from 'pubsub-js';

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
