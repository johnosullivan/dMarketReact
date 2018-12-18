import React from 'react'
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';

import { 
  Button
} from 'react-bootstrap';

import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import PubSub from 'pubsub-js';
import { Document, Page } from 'react-pdf';

import path from 'path';
import doc from './sample.pdf';


import cryptojs from 'crypto-js';
import aesjs from 'aes-js';
import { sha256, sha224 } from 'js-sha256';

/*
 <Button variant="uport" onClick={() => {
            PubSub.publish('UPORT_LOGOUT', Date())
          }}> 
          UPORT_LOGOUT        
        </Button>
        */

class Body extends React.Component {

  state = {
    numPages: null,
    pageNumber: 1,
    file: ''
  }

  constructor(props) {
    super(props);

    console.log(doc);
  }

  back = () => {
    this.setState({ pageNumber: --this.state.pageNumber });
  }

  forward = () => {
    this.setState({ pageNumber: ++this.state.pageNumber });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
  }

  hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }


  handleAddDCFile(selectorFiles) { 
    var reader = new FileReader();
    var self = this;

    reader.onload = function() {
      const password = 'password123';

      const rawData = new Uint8Array(reader.result);
      const hexData = self.bytesToHex(rawData);
      const encryptData = cryptojs.AES.encrypt(hexData, password).toString();

      const decryptbytes  = cryptojs.AES.decrypt(encryptData, password);
      const encoding = decryptbytes.toString(cryptojs.enc.Utf8);
      const bytes = new Uint8Array(self.hexToBytes(encoding));  
      
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const urlCreator = window.URL || window.webkitURL;
      const file = urlCreator.createObjectURL(blob);

      self.setState({ file });
    }
    reader.readAsArrayBuffer(selectorFiles[0]);
  }

  render() {
    console.log('Body: ', this.props);

    const { pageNumber, numPages, file } = this.state;

    const listItems = this.props.productListings.map((item, i) =>
      <div key={item.id}>{item.title}</div>
    );



    return (
      <Container text style={{ marginTop: '5em', marginBottom: '2em' }}>
  
       
<div>
        <Document
          file={file}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        <Button variant="primary" onClick={this.back}> 
                  B
                </Button>
                <Button variant="primary" onClick={this.forward}> 
                  F
                </Button>
      </div>
        <br/>
        <br/>
        <input onChange={ (e) => this.handleAddDCFile(e.target.files) } type='file'/>
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