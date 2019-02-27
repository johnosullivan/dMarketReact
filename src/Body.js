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

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';


import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import { 
  HomePage,
  SearchPage,
  MyFilesPage
} from "./components/pages";

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
    acontract: '',
    left: false
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

    const self = this;
    contract.getData.call(0, async function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);

        let ipfs = ipfsClient('/ip4/142.93.156.212/tcp/5001');
        const fileData = await ipfs.cat(result[1]);

        console.log(fileData);

        const decryptbytes  = cryptojs.AES.decrypt(fileData.toString('utf8'), result[2]);
        const encoding = decryptbytes.toString(cryptojs.enc.Utf8);
        const bytes = new Uint8Array(self.hexToBytes(encoding));

        const blob = new Blob([bytes], { type: 'application/pdf' });
        const urlCreator = window.URL || window.webkitURL;
        const file = urlCreator.createObjectURL(blob);

        self.setState({ file });
      }
    });

    console.log(contract);
    

  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  

  render() {
    const { pageNumber, numPages, file } = this.state;


    const Home = () => (
      <div>
        <h2>Home</h2>
      </div>
    );
    
    const About = () => (
      <div>
        <h2>About</h2>
      </div>
    );

    const style = {
      outline: 'none'
    };

    return (
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
            <IconButton color="inherit" aria-label="Menu" style={style} onClick={this.toggleDrawer('left', true)}>
              <MenuIcon />
            </IconButton>


            </Toolbar>
          </AppBar>

          <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)} > 
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
                style={{
                  width: 300,
                  flexShrink: 0
                }}>
                <List>
                  <Link to="/search">
                    <ListItem button key="search">
                      <ListItemText primary="Search"/>
                    </ListItem>
                  </Link>
                  <Link to="/myfiles">
                    <ListItem button key="myfiles">
                      <ListItemText primary="My Files"/>
                    </ListItem>
                  </Link>
                  <Link to="/">
                    <ListItem button key="search">
                      <ListItemText primary="Home"/>
                    </ListItem>
                  </Link>
                </List>
                <Divider/>
              </div>
          </Drawer>
          
          <Route exact path="/" component={HomePage}/>
          <Route path="/search" component={SearchPage}/> 
          <Route path="/myfiles" component={MyFilesPage}/>                
        </div>
        </Router>
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
