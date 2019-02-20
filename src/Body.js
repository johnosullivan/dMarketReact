import React from 'react'
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';
import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';

import abi from './abi.json';

import dataProvider from './DataProvider';

import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import PubSub from 'pubsub-js';
import { Document, Page } from 'react-pdf';

import path from 'path';

import cryptojs from 'crypto-js';
import aesjs from 'aes-js';
import { sha256, sha224 } from 'js-sha256';
import { or } from 'ip';

import FileBuild from './contracts/build/File.json';


const web3 = new window.Web3(window.web3.currentProvider);

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

class Body extends React.Component {

  state = {
    numPages: null,
    pageNumber: 1,
    file: '',
    version: '',
    price: '',
    description: '',
    name:'',
    author: '',
    acontract: ''
  }

  constructor(props) {
    super(props);


    this.fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
    this.file = web3.eth.contract(abi.file);
    this.tempfile = {};
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

  async handleAddDCFile(selectorFiles) {

    //const dataProvider = DataProvider['DataProvider'];
    //await dataProvider.addFile(selectorFiles[0], { });

  /*  const x = dataProvider['dataProvider'];

    const data = await x.addFile(selectorFiles[0], { });
    console.log(data);
    this.tempfile = data;
*/

    this.setState({ file: selectorFiles[0]});
    /*
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
    reader.readAsArrayBuffer(selectorFiles[0]);*/

  }

  uploadDataIPFS = async (data) => {
    let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
    let content = ipfs.types.Buffer.from(data);
    let results = await ipfs.add(content);
    return results[0];
  };

  testingIPFS = async () => {
    console.log('testingIPFS');

    const bytecode = '';

    const {
      fileHash,
      hashDetails,
      password
    } = this.tempfile;

    // Contract object
    const contract = web3.eth.contract(abi['file']);

    // Deploy contract instance
    const contractInstance = contract.new('v1.0', fileHash, password, hashDetails, {
      data: bytecode,
      from: web3.eth.defaultAccount
    }, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }

      console.log(res.transactionHash);

      if (res.address) { console.log('Contract address: ' + res.address); }
    });
    /*
    const data = {
      'productName':'COMP 150 Study Guide',
      'productTags':'Study Guide,PDF,LUC,COMP 150'
    };
    const results = await this.uploadDataIPFS(JSON.stringify(data));
    console.log(results);
    */
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

  add = async () => {
    const fileBuild = FileBuild['contracts']['File.sol:File'];

    const { bytecode } = fileBuild;

    const {
      author,
      name,
      description,
      price,
      version,
      file
    } = this.state;
    const provider = dataProvider['dataProvider'];
    const { hashDetails, fileHash, password } = await provider.addFile(file, { author, name, description, price, version });

    // Contract object
    const contract = web3.eth.contract(abi['file']);

    // Deploy contract instance
    const contractInstance = contract.new(version, fileHash, password, hashDetails, {
      data: bytecode,
      from: web3.eth.defaultAccount
    }, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }

      console.log(res.transactionHash);

      if (res.address) { console.log('Contract address: ' + res.address); }
    });
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

  load = () => {
    const file = FileBuild['contracts']['File.sol:File'];

    const { acontract } = this.state;

    // Contract object
    const contract = web3.eth.contract(JSON.parse(file['interface'])).at(acontract);

    contract.getData.call(0, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });

    console.log(contract);
    

  };

  render() {
    console.log('Body: ', this.props);

    const { pageNumber, numPages, file } = this.state;

    const listItems = this.props.productListings.map((item, i) =>
      <div key={item.id}>{item.title}</div>
    );

//0x8119aaBc94CdE2aB47d0C9Bc60d4829514b89481

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

      </div>
        <br/>
        <TextField
          id="version"
          label="Version"
          margin="normal"
          value={this.state.version} onChange={(event) => { this.setState({version: event.target.value}); }}
        />
        <br/>
        <TextField
          id="name"
          label="Name"
          margin="normal"
          value={this.state.name} onChange={(event) => { this.setState({name: event.target.value}); }}
        />
        <br/>
        <TextField
          id="description"
          label="Description"
          margin="normal"
          value={this.state.description} onChange={(event) => { this.setState({description: event.target.value}); }}
        />
        <br/>
        <TextField
          id="price"
          label="Price"
          margin="normal"
          value={this.state.price} onChange={(event) => { this.setState({price: event.target.value}); }}
        />
        <br/>
        <TextField
          id="author"
          label="Author"
          margin="normal"
          value={this.state.author} onChange={(event) => { this.setState({author: event.target.value}); }}
        />
        <br/>
        <input onChange={ (e) => this.handleAddDCFile(e.target.files) } type='file'/>
        <br/>
        <br/>
        <Button variant="contained" color="secondary" onClick={this.add}>
            Add
        </Button>
        <br/>
        <br/>
        <br/>
        <br/>
        <TextField
          id="address_contract"
          label="Address Contract"
          margin="normal"
          value={this.state.acontract} onChange={(event) => { this.setState({acontract: event.target.value}); }}
        />
        <br/>
        <br/>
        <Button variant="contained" color="secondary" onClick={this.load}>
            Load
        </Button>
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
