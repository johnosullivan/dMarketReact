import React, { Component } from 'react';

import aesjs from 'aes-js';

import ipfsAPI from 'ipfs-api';

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

    var HttpClient = function() {
        this.get = function(uri, callback) {
        // XMLHttpRequest Get Method
        var request = new XMLHttpRequest();
        // Fires once the state of the request changes
        request.onreadystatechange = function() {
            // If the request is of the right code fire the callback
            if (request.readyState == 4 && request.status == 200) { callback(request.responseText); }
        }
        // Sets the param and sends the request
        request.open("GET",uri,true);
        request.send(null);
        }
    }

    /*
    var client = new HttpClient();
    client.get("http://localhost:8080/ipfs/QmSiKQMP3SiTGaNj6no2BrtvaAhUhSwvnXkNF7UYA7hWs8", function(response) {
        console.log(response);
    });
    */


    // Testing secure file selling on the eth blockchain!
    var product = this.state;
    var file = product['content'][0];

    console.log(file);

    var reader = new FileReader();

    reader.onload = function() {
      var arrayBuffer = reader.result;
      var bytes = new Uint8Array(arrayBuffer);

      console.log(aesjs);

      console.log(bytes);
      console.log(bytes.length);

      Uint8Array.prototype.chunk = function (n) {
        if (!this.length) {
        return [];
        }
        return [ this.slice(0,n) ].concat(this.slice(n).chunk(n));
      };

      var chunk_num = 4;
      var chunk_size = bytes.length / chunk_num;
      var chunks = bytes.chunk(chunk_size);

      console.log(chunks);

      /*
      var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                 29, 30, 31];


      var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      var encryptedBytes = aesCtr.encrypt(bytes);

      console.log(encryptedBytes);

      var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

      console.log(encryptedHex);
      console.log(encryptedHex.length);

      var encryptedBytesA = aesjs.utils.hex.toBytes(encryptedHex);

      var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      var decryptedBytes = aesCtr.decrypt(encryptedBytesA);

      console.log(decryptedBytes);
      */

      /*var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});

      var data = new Buffer(encryptedHex);
      var path = "testing.data";
      const stream = ipfs.files.addReadableStream();
      stream.on('data', function (file) {
        console.log(file);
        var hash = file['hash'];
        console.log(hash);
      });
      stream.write({ path: path, content: data });
      stream.end();*/

    }

    reader.readAsArrayBuffer(file);



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
