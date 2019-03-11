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


import { 
  HomePage,
  SearchPage,
  MyFilesPage,
  FileView
} from "./components/pages";

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

/*
    this.fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
    this.file = web3.eth.contract(abi.file);
    this.tempfile = {};
*/
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

 
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
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
          <Route path="/file/:address" component={FileView}/>  
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
