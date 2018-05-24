import React, { Component } from 'react';
import aesjs from 'aes-js';
import ipfsAPI from 'ipfs-api';

import DataHelper from './DataHelper';
import jsd from 'js-file-download';
import Web3Helper from './Web3Helper';
import cryptojs from 'crypto-js';
import chance from 'chance';

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
      marketfiles: [],
      testObj:{}
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
        marketfiles: [],
        testObj:{}
      };
    }

    this.submit = this.submit.bind(this);

    this.submit2 = this.submit2.bind(this);
    this.datahelper = new DataHelper();
    this.web3helper = new Web3Helper();
  }

  // Handling all the bind and state change
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

  submit2() {

    var self = this;
    this.web3helper.addedFile().then((txhash) => {
      console.log("Final TXHash", txhash);
      console.log(self.web3helper);
      /*self.web3helper.waitForReceipt(txhash, function (receipt) {
        console.log(receipt);
      });*/
    });


    /*
    var testObj = this.state['testObj'];
    console.log(testObj);

    this.datahelper.getFile(testObj).then(data => {
      console.log(data);
      jsd(new Uint8Array(data), 'filename.png');
    })
    .catch(err => console.log(err));
    */

    //console.log(chance.guid());
    /*
    var uri = "http://localhost:8080/ipfs/Qmcw87rUakyb2siK9yWmV1J6JDPKJtq2KABWDJv8AQYCak";

    //console.log(uri);

    //console.log(jsd);

    //console.log(this.datahelper.generateKey(50));


    var self = this;
    this.datahelper.get(uri, function(response) {
      //console.log(response);
      //console.log(self);

      //var bytes = self.datahelper.hexToBytes(response);

      //var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

      //var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      //var decryptedBytes = aesCtr.decrypt(bytes);

      //var data = new Uint8Array(decryptedBytes);

      //jsd(data, 'filename.png');

      var key = self.datahelper.generateKey(50);

      var ciphertext = cryptojs.AES.encrypt(response, key);

      console.log(ciphertext.toString());

      // Decrypt
      var bytes  = cryptojs.AES.decrypt(ciphertext.toString(), key);
      var plaintext = bytes.toString(cryptojs.enc.Utf8);

      //console.log(plaintext);

    });
    */

    // Encrypt



  }

  submit() {
    // Gets the product from the state component
    var product = this.state;
    // Checks if the product has contents
    if (product['content'].length > 0) {
      // Gets the file from state
      var file = product['content'][0];
      // Uses the helper to hex file and put on ipfs
      this.datahelper.uploadingFile(file, product.seller)
      .then(data => {
        console.log(data);
        this.setState({ testObj: data });
      })
      .catch(err => console.log(err));
    }
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
            <Button content='Download' onClick={this.submit2}/>
          </Form.Field>
      </Form>
      </Card>
      </div>
    );
  }
}

export default AddProduct;
