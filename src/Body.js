import React from 'react'
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';
import ipfsClient from 'ipfs-http-client';

import abi from './abi.json';

import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import Typography from '@material-ui/core/Typography';
 
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import { 
  HomePage,
  SearchPage,
  MyFilesPage
} from "./components/pages";

const web3 = new window.Web3(window.web3.currentProvider);

const Box = require('3box');

/*
Box.openBox('0x8ca34635eB1DC9AA9bDbF274D8DeAA85Cf1cB2b9', window.web3.currentProvider).then(async box => {
  // interact with 3Box data
  console.log('box: ', box);
  await box.public.remove('name')
  await box.public.set("firstName", "John");
  await box.public.set("lastName", "O'Sullivan");
  await box.public.set("email", "jnosullivan@icloud.com");
  await box.public.set("photo", "QmR5ky9Tc1okum6YgxBTYNwMDGfQTFx3ZvinS9Gmr15a7G");
})
*/

//0x59411045D41B538AfF6685B34c4F2654FA773e3A 0x8ca34635eB1DC9AA9bDbF274D8DeAA85Cf1cB2b9
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
    left: false,
    profile: {
      email: '',
      firstName: '',
      lastName: '',
      photo: ''
    }
  }

  constructor(props) {
    super(props);


    this.fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
    this.file = web3.eth.contract(abi.file);
    this.tempfile = {};

    this.getP();
  }

  getP = async () => {
    try {
      const profile = await Box.getProfile('0x8ca34635eB1DC9AA9bDbF274D8DeAA85Cf1cB2b9');
      console.log(profile);

      this.setState({ profile });
    } catch (err) {
      console.log(err);
    }
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
    /*const fileBuild = FileBuild['contracts']['File.sol:File'];

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
    });*/
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
    /*
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
    */

  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  z = async (selectorFiles) => {
    var reader = new FileReader();

    reader.onload = async function() {
      const rawData = new Uint8Array(reader.result);

      let ipfs = ipfsClient('/ip4/142.93.156.212/tcp/5001');
      let content = ipfs.types.Buffer.from(rawData);
      let results = await ipfs.add(content);

      console.log(results);
    }
    reader.readAsArrayBuffer(selectorFiles[0]);
  };

  render() {
    console.log('state: ', this.state);

    const { profile } = this.state;

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

                <br/>
                <div style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 5,
                  paddingBottom: 0
                }}>

                <Grid container spacing={16}>
                  <Grid item>
                    <Avatar alt="" src={'https://ipfs.io/ipfs/' + profile.photo}/>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={16}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          {profile['firstName'] + " " + profile['lastName']}
                        </Typography>
                        <Typography gutterBottom>{profile['email']}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                </div>

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
                </List>
                <Divider/>
              </div>
          </Drawer>






          <Dialog open={false} aria-labelledby="welcomd-dialog-title">
              <DialogTitle id="welcomd-dialog-title">Welcome to dMarket</DialogTitle>

              <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </DialogContentText>
            <div>
                <TextField
                id="firstName"
                label="First Name"
                defaultValue=""
                margin="dense"
                fullWidth/>
                <TextField
                id="lastName"
                label="Last Name"
                defaultValue=""
                margin="dense"
                fullWidth/>
                <TextField
                id="email"
                label="Email"
                defaultValue=""
                margin="dense"
                fullWidth/>
              </div>
              <br/>
              <input type="file" onChange={ (e) => this.z(e.target.files) } />

          </DialogContent>

              <DialogActions>
                <Button  color="primary">
                  Done
                </Button>
              </DialogActions>
          </Dialog>







          
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
