import React from 'react'
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';
import { 
  Button
} from 'react-bootstrap';

import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';

import PubSub from 'pubsub-js';

class Body extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log('Body: ', this.props);

    const listItems = this.props.productListings.map((item, i) =>
      <div key={item.id}>{item.title}</div>
    );

    return (
      <Container text style={{ marginTop: '5em', marginBottom: '2em' }}>
  
        <Button variant="uport" onClick={() => {
            PubSub.publish('UPORT_LOGOUT', Date())
          }}> 
          UPORT_LOGOUT        
        </Button>

        <br/>
        <br/>
        <br/>
  
        {listItems}

      </Container>
  );
  };

}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    productListings: state.dmarket.productListings
  }
}
export default connect(mapStateToProps)(Body)