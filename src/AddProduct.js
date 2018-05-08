import React, { Component } from 'react';

import {
  Button,
  Icon,
  Modal,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Input,
  Form,
  Card,
  TextArea
} from 'semantic-ui-react';

import Web3 from 'web3';

class AddProduct extends Component {

  constructor() {
    super();


    if (typeof window.web3 === 'undefined') {
      console.error("Please use a web3 browser");
    } else {
      var myWeb3 = new Web3(window.web3.currentProvider);
      myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
      this.public_address = myWeb3.eth.defaultAccount;
    }


  }

  handleMessage (e) {
    console.log(e.target.value);
  }

  render() {

    return (
      <div>

<Card fluid style={{ padding: '10px' }}>
      <h3>Add Product</h3>
      <Form>
      <Form.Field>
        <label>Product Name:</label>
        <Input onChange={this.handleMessage.bind(this)} placeholder='name'/>
      </Form.Field>
      <Form.Field>
        <label>Description:</label>
        <TextArea placeholder='info on the product' />
      </Form.Field>
      <Form.Field>
        <label>Seller:</label>
        <Input placeholder='seller' disabled value={this.public_address}/>
      </Form.Field>
    </Form>

</Card>

      </div>
    );
  }
}

export default AddProduct;
