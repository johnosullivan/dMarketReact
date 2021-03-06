import React from 'react'
import { connect } from 'react-redux';
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
import Providers from './DataProvider';
import PubSub from 'pubsub-js'

import { EpubView } from "react-reader";

import {
  HomePage,
  SearchPage,
  MyFilesPage,
  FileView
} from "./components/pages";

const Box = require('3box');

const web3 = new window.Web3(window.web3.currentProvider);


Box.openBox('0x7899243003E5220F87Ddc5DBA790B775b3E459e6', window.ethereum).then(box => {
  console.log(box);
})


class Body extends React.Component {

  state = {
    left: false,
    email: '',
    firstName: '',
    lastName: '',
    photo: '',
    boxDialog: false,
    profile: {
      email: '',
      firstName: '',
      lastName: '',
      photo: ''
    },
    navBarTitle: 'dMarket'
  }

  constructor(props) {
    super(props);

    this.dataProvider = Providers.dataProvider;

    this.checkProfile();

    this.titlePubSub = PubSub.subscribe('SET_TITLE', (msg, navBarTitle) => {
      this.setState({ navBarTitle });
    });
  }

  getWeb3Account = async () => {
    return new Promise(function(resolve, reject) {
      web3.eth.getAccounts(async function(err, accounts) {
        if (err) { reject(err); } else { resolve(accounts[0]); }
      });
    });
  }

  checkProfile = async () => {
    const account = await this.getWeb3Account();
    try {
      const data = await Box.getProfile(account);
      console.log(data);
      if (data) {
        if (Object.keys(data).length) {
          if (data.profile) {
            console.log(data.profile);
            this.setState({ boxDialog: false, profile: data.profile });
          } else {
            this.setState({ boxDialog: true });
          }
        } else {
          this.setState({ boxDialog: true });
        }
      } else {
        this.setState({ boxDialog: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({ [side]: open, });
  };

  doneProfile = async () => {
    const { firstName, lastName, email, photo } = this.state;

    const account = await this.getWeb3Account();

    const box = await Box.openBox(window.ethereum.selectedAddress, window.ethereum, {});
    console.log(box);

    const profile = {
      firstName, lastName, email, photo
    };

    await box.public.set('profile', profile);
  };

  uploadPicPro = (files) => {
    const reader = new FileReader();
    let self = this;
    reader.onload = async function() {
        const rawData = new Uint8Array(reader.result);
        const hashObject = await self.dataProvider.uploadDataIPFS(rawData);
        const photo = hashObject['hash'];
        self.setState({ photo });
    }
    reader.readAsArrayBuffer(files[0]);
  };

  render() {
    console.log('state: ', this.state);

    const { profile, boxDialog, navBarTitle } = this.state;

    const style = {
      outline: 'none',
      marginLeft: -12,
      marginRight: 20
    };

    return (
      <Router>
        <div>
          <AppBar position="fixed">
            <Toolbar>
            <IconButton color="inherit" aria-label="Menu" style={style} onClick={this.toggleDrawer('left', true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {navBarTitle}
            </Typography>
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
                    <Avatar alt="" src={'https://ipfs.io/ipfs/' + profile['photo']}/>
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
                  <Link to="/files">
                    <ListItem button key="c">
                      <ListItemText primary="Files"/>
                    </ListItem>
                  </Link>
                  <Link to="/">
                    <ListItem button key="home">
                      <ListItemText primary="Home"/>
                    </ListItem>
                  </Link>
                </List>
                <Divider/>
              </div>
          </Drawer>






          <Dialog open={boxDialog} aria-labelledby="welcomd-dialog-title">
              <DialogTitle id="welcomd-dialog-title">Welcome to dMarket</DialogTitle>

              <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </DialogContentText>
            <div>
                <TextField
                id="firstName"
                label="First Name"
                alue={this.state.firstName} onChange={this.handleChange('firstName')}
                margin="dense"
                fullWidth/>
                <TextField
                id="lastName"
                label="Last Name"
                alue={this.state.lastName} onChange={this.handleChange('lastName')}
                margin="dense"
                fullWidth/>
                <TextField
                id="email"
                label="Email"
                alue={this.state.email} onChange={this.handleChange('email')}
                margin="dense"
                fullWidth/>
              </div>
              <br/>
              <input type="file" onChange={ (e) => this.uploadPicPro(e.target.files) } />

          </DialogContent>

              <DialogActions>
                <Button color="primary" onClick={this.doneProfile}>
                  Done
                </Button>
              </DialogActions>
          </Dialog>


          <div style= {{ 'paddingTop': '64px'}}>
          <Route exact path="/" component={HomePage}/>
          <Route path="/search" component={SearchPage}/>
          <Route path="/files" component={MyFilesPage}/>
          <Route path="/file/:address" component={FileView}/>
          </div>
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
