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
  TextArea,
  Tab,
  Label
} from 'semantic-ui-react';

import Web3 from 'web3';

class AddProduct extends Component {

  constructor() {
    super();

    this.state = {
      seller: "",
      name:"",
      description:"",
      video:"",
      videoType:"",
      firstName:"",
      lastName:"",
      address:"",
      phone:"",
      website:"",
      price:0,
      content: [],
      marketfiles: []
    };

    if (typeof window.web3 === 'undefined') {
      console.error("Please use a web3 browser");
    } else {
      var myWeb3 = new Web3(window.web3.currentProvider);
      myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
      this.state = {
        seller: myWeb3.eth.defaultAccount,
        name:"",
        description:"",
        video:"",
        videoType:"",
        firstName:"",
        lastName:"",
        address:"",
        phone:"",
        website:"",
        price:"",
        content: [],
        marketfiles: []
      };
    }
    this.submit = this.submit.bind(this);
  }

  handleName(e) { this.setState({ name: e.target.value }); }
  handleDescription(e) { this.setState({ description: e.target.value }); }
  handleVideo(e) { this.setState({ video: e.target.value }); }
  handleFirstName(e) { this.setState({ firstName: e.target.value }); }
  handleLastName(e) { this.setState({ lastName: e.target.value }); }
  handleAddress(e) { this.setState({ address: e.target.value }); }
  handlePhone(e) { this.setState({ phone: e.target.value }); }
  handleWebsite(e) { this.setState({ website: e.target.value }); }
  handlePrice(e) { this.setState({ price: e.target.value }); }
  handleVideoYoutube(e) { this.setState({ videoType: e.target.value }); }
  handleVideoVimeo(e) { this.setState({ videoType: e.target.value }); }
  handleAddDCFile(selectorFiles: FileList) { this.setState({ content: selectorFiles }); }
  handleAddMCFile(selectorFiles: FileList) { this.setState({ marketfiles: selectorFiles }); }

  submit() {
    // Testing secure file selling on the eth blockchain!
    var product = this.state;
    console.log(product);
  }

  render() {
    return (
      <div>
        <Card fluid style={{ padding: '10px' }}>
        <h3>Add Product</h3>
        <Form>
          <Form.Group unstackable widths={2}>
            <Form.Input label='First name' placeholder='First name' value={this.state.firstName} onChange={this.handleFirstName.bind(this)}/>
            <Form.Input label='Last name' placeholder='Last name' value={this.state.lastName} onChange={this.handleLastName.bind(this)}/>
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input label='Address' placeholder='Address' value={this.state.address} onChange={this.handleAddress.bind(this)}/>
            <Form.Input label='Phone' placeholder='Phone' value={this.state.phone} onChange={this.handlePhone.bind(this)}/>
          </Form.Group>
          <Form.Field>
            <label>Product Name:</label>
            <Input onChange={this.handleName.bind(this)} value={this.state.name} placeholder='name'/>
          </Form.Field>
          <Form.Field>
            <label>Ether Price:</label>
            <Input label='♦' labelPosition='left' type='text' placeholder='Amount' value={this.state.price} onChange={this.handlePrice.bind(this)}/>
          </Form.Field>
          <Form.Field>
            <label>Website:</label>
            <Input label='http://' placeholder='mysite.com' value={this.state.website} onChange={this.handleWebsite.bind(this)}/>
          </Form.Field>
          <Form.Field>
            <label>Description:</label>
            <TextArea onChange={this.handleDescription.bind(this)} value={this.state.description} placeholder='' />
          </Form.Field>
          <Form.Field>
              <label>Add Digital Product:</label>
            <input onChange={ (e) => this.handleAddDCFile(e.target.files) } type='file'/>
          </Form.Field>
          <Form.Field>
            <label>Seller Public Address:</label>
            <Input disabled value={this.state.seller}/>
          </Form.Field>
          <Form.Field>
            <label>Add Digital Marketing Content:</label>
            <input type='file' multiple onChange={ (e) => this.handleAddMCFile(e.target.files) }/>
          </Form.Field>
          <Form.Field>
            <label>Video Link:</label>
            <Input value={this.state.video} onChange={this.handleVideo.bind(this)}/>
          </Form.Field>
          <Form.Field>
            <Form.Checkbox inline label='I agree to the terms and conditsions' required/>
            <Button content='Deploy Digital Product' icon='plus' labelPosition='left' onClick={this.submit}/>
          </Form.Field>
      </Form>
      </Card>
      </div>
    );
  }
}

export default AddProduct;
