import React from 'react'
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';
import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';

import abi from './abi.json';

import { 
  Button
} from 'react-bootstrap';

import PubSub from 'pubsub-js';
import { Document, Page } from 'react-pdf';

import path from 'path';
import doc from './sample.pdf';


import cryptojs from 'crypto-js';
import aesjs from 'aes-js';
import { sha256, sha224 } from 'js-sha256';
import { or } from 'ip';

 
const web3 = new window.Web3(window.web3.currentProvider);

class Body extends React.Component {

  state = {
    numPages: null,
    pageNumber: 1,
    file: ''
  }

  constructor(props) {
    super(props);

    this.fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
    this.file = web3.eth.contract(abi.file);
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

    reader.onload = async function() {
      const password = randomstring.generate();

      const rawData = new Uint8Array(reader.result);
      const hexData = self.bytesToHex(rawData);
      const encryptData = cryptojs.AES.encrypt(hexData, password).toString();

      let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
      let content = ipfs.types.Buffer.from(encryptData);
      let results = await ipfs.add(content);
      let hash = results[0].hash; 

      const data = self.fileManager.addFile.getData("application/pdf",hash,"chuck","name",'Resume.pdf',"Accepisse has partiales reliquiae archetypi consortio uti. Sequentium tum tur falsitatem realitatis usu. Eae probatur qualitas singulae cui supponam arbitror quadrati. Facultates satyriscos exponantur me ac at continuata ne excoluisse perfectior. Praesertim sae cucurbitas quantumvis sua objectioni secernitur cogitantem duo. Res qualis quinta sub loquor cau soleam multae etc mandat. To in nulli novam pappo athei sequi ausim ei. Diversi et ex occasio agnosci divelli im videmus. Cum creatione industria mea cur sic cerebella. ");
      const result = await self.sendTransaction(data, '0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');

      const fileData = await ipfs.cat(hash);
      const decryptbytes  = cryptojs.AES.decrypt(fileData.toString('utf8'), password);
      const encoding = decryptbytes.toString(cryptojs.enc.Utf8);
      const bytes = new Uint8Array(self.hexToBytes(encoding));  
      
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const urlCreator = window.URL || window.webkitURL;
      const file = urlCreator.createObjectURL(blob);

      self.setState({ file });
    }
    reader.readAsArrayBuffer(selectorFiles[0]);
  }

  uploadDataIPFS = async (data) => {
    let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
    let content = ipfs.types.Buffer.from(data);
    let results = await ipfs.add(content);
    return results[0]; 
  };

  testingIPFS = async () => {
    const data = {
      'productName':'COMP 150 Study Guide',
      'productTags':'Study Guide,PDF,LUC,COMP 150'
    };
    const results = await this.uploadDataIPFS(JSON.stringify(data));
    console.log(results);
  };


  getMyFilesCount = async () => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.fileManager.getMyFilesCount(function(err, data) { 
        if (err) { reject(err); } else { resolve(data['c'][0]); }
      });
    });
  };

  getMyFilesAt = async (index) => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.fileManager.getMyFilesAt(index, function(err, data) { 
        if (err) { reject(err); } else { resolve(data); }
      });
    });
  };

  getFilePublicDetails = async (address) => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.file.at(address).getPublicDetails(function(err, data) { 
        if (err) { reject(err); } else { resolve(data); }
      });
    });
  };

  

  testTrasaction = async () => {

    const myFilesCount = await this.getMyFilesCount();
    let myFilesAddresses = [];

    for (const index of Array(myFilesCount).keys()) {
      const fileAddress = await this.getMyFilesAt(index);
      const filePublicDetails = await this.getFilePublicDetails(fileAddress);
      myFilesAddresses.push(filePublicDetails);
    }

    

    console.log(myFilesAddresses);


/*
    Contract.getMyFilesAt(0, function(err, data) { 
      if (err) {
      }
      console.log(data);
  });*/

/*
    const address = '0xb565e58bda6f31647719a1b162080e982f80bc87';
    let FileManager = web3.eth.contract(abi.filemanager);
    let Contract = FileManager.at(address);
    const data = Contract.addFile.getData("","","","","","description");

    try {
      const result = await this.sendTransaction(data, address);
      console.log(result);
    } catch (error) { } */

  }

  sendTransaction = (data, address) => {
    const transactionData = data;
    const transactionAddress = address;
    return new Promise(function(resolve, reject) {
        web3.eth.sendTransaction({from: web3.currentProvider.selectedAddress , to: transactionAddress, data: transactionData }, function(err, transactionHash) { 
          if (err) {
            reject(err);
          } else {
            resolve(transactionHash);
          }
        });
    });
  }

  testGetFiles = () => {
    console.log('testGetFiles');
    const address = '0xf25e4afe1c33e25e4fe245029f25a5f7b76680c4';
    let FileManager = web3.eth.contract(abi.filemanager);
    let Contract = FileManager.at(address);
    console.log(Contract);
    let data = Contract.boughtFiles(web3.currentProvider.selectedAddress,0, function(err, transactionHash) { 
      console.log(transactionHash);
    });
  };

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
                <Button variant="primary" onClick={this.testTrasaction}> 
                  Test Transaction
                </Button>
                <Button variant="primary" onClick={this.testingIPFS}> 
                  Test IPFS
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