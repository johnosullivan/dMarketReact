import React from 'react';
import { connect } from 'react-redux';

import Providers from './../../DataProvider';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Typography from '@material-ui/core/Typography';

import PubSub from 'pubsub-js';

import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Slide from '@material-ui/core/Slide';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MyFiles extends React.Component {

  state = {
    fileName: '',
    title: '',
    version: '',
    fileAuthor: '',
    description: '',
    price: '',
    file: [],
    isAdding: false,
    myFiles: [],
    boughtFiles: [],
    tabValue: 0
  };

  constructor(props) {
    super(props);

    this.dataProvider = Providers.dataProvider;
  }

  componentWillMount() {
    PubSub.publish('SET_TITLE', 'Files');
    this.loadFiles();
  }

  loadFiles = () => {
    let self = this;
    this.dataProvider.getMyFiles().then(async function(data) {
      let myFiles = [];
      for (let address of data) {
        const res = await self.dataProvider.getFilePublicDetails(address);
        myFiles.push({ address, owner: res.owner, ... res.data });
      }
      self.setState({ myFiles });
    });
    this.dataProvider.getBoughtFiles().then(async function(data) {
      let boughtFiles = [];
      for (let address of data) {
        const res = await self.dataProvider.getFilePublicDetails(address);
        boughtFiles.push({ address, owner: res.owner, ... res.data });
      }
      self.setState({ boughtFiles });
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async () => {
    const { 
        fileName, title, version,
        fileAuthor, description,
        price, file
    } = this.state;

    const details = {
        fileName, title, version,
        fileAuthor, description, price
    };

    const { 
        hashDetails,
        fileHash,
        password
    } = await this.dataProvider.addFile(file[0], details);

    const np = parseInt(String(price).padEnd(18,0));

    console.log('Submit');
    console.log(this.state);

    this.dataProvider.transactionFile(version, fileHash, password, hashDetails, np);
    
   this.setState({ isAdding: false });
  };

  view = async (index, event) => {
    /*console.log('view index:', index);
    console.log(this.state);
    const { myFiles = [] } = this.state;
    const file = myFiles[index - 1];
    console.log(file);
    const balance = await this.dataProvider.getFileBalance(file.address);
    console.log('balance: ', balance);*/

    const { myFiles = [] } = this.state;
    const file = myFiles[index - 1];
    this.props.history.push('/file/' + file.address)

  };

  handleChangeIndex = index => {
    this.setState({ 'tabValue': index });
  };

  handleChangeTwo = (event, value) => {
    this.setState({ 'tabValue':value });
  };

  addFile = () => {
    console.log('add file');
    this.setState({ isAdding: true });
  };

  handleChangeCancelAdd = (event, value) => {
    this.setState({ isAdding: false });
  };

  render() {
    const { myFiles = [], boughtFiles = [] } = this.state;
    console.log(this.state);

    const myItems = myFiles.map((file, i) =>
        <ListItem key={i} style={{
            backgroundColor:'white'
        }}>
        <ListItemText
          primary={file.title + ' - ' + file.price + ' dPUB - ' + file.address}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {file.description}
              </Typography>
            </React.Fragment>
          }
        />
        <Button variant="contained" color="secondary" onClick={(event) => this.view(1, event)}>
            Open
        </Button>
        </ListItem> 
    );

    const boughtItems = boughtFiles.map((file, i) =>
        <ListItem key={i} style={{
            backgroundColor:'white'
        }}>
        <ListItemText
          primary={file.title + ' - ' + file.price + ' dPUB Created By: ' + file.owner }
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {file.description}
              </Typography>
            </React.Fragment>
          }
        />
        <Button variant="contained" color="secondary" onClick={(event) => this.view(1, event)}>
            Open
        </Button>
        </ListItem> 
    );

    return (
      <div>
        <Dialog fullScreen open={this.state.isAdding} aria-labelledby="welcomd-dialog-title" TransitionComponent={Transition}>
            <DialogTitle id="welcomd-dialog-title">Add File</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            </DialogContentText>
            <div>
                <TextField value={this.state.fileName} onChange={this.handleChange('fileName')} id="fileName" label="File Name" margin="dense" variant="outlined" fullWidth/>
                <TextField value={this.state.title} onChange={this.handleChange('title')} id="title" label="Title" margin="dense" variant="outlined" fullWidth/> 
                <TextField value={this.state.version} onChange={this.handleChange('version')} id="version" label="Version" margin="dense" variant="outlined" fullWidth/>
                <TextField value={this.state.fileAuthor} onChange={this.handleChange('fileAuthor')} id="fileAuthor" label="Author" margin="dense" variant="outlined" fullWidth/>   
                <TextField value={this.state.description} onChange={this.handleChange('description')} id="description" label="Description" margin="dense" variant="outlined" multiline rowsMax="4" fullWidth/>
                <TextField value={this.state.price} onChange={this.handleChange('price')} id="price" label="Price (dPUB)" margin="dense" variant="outlined" fullWidth/>           
            </div>
            <br/> 

            <input type="file" onChange={ (e) => this.setState({ file: e.target.files }) } />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleSubmit} color="primary">
                  Add File
                </Button>
                <Button onClick={this.handleChangeCancelAdd} color="primary">
                  Cancel
                </Button>
            </DialogActions>
        </Dialog>

        <div className={{
          width: 500
        }}>
        <AppBar color="default" style={{
    top: 'auto',
    bottom: 0,
  }}>
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleChangeTwo}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth">

            <Tab style={{ outline: 'none' }} label="Purchased Documents" />
            <Tab style={{ outline: 'none' }} label="My Documents" />
          </Tabs>
        </AppBar>
        <SwipeableViews
            axis='x'
            index={this.state.tabValue}
            onChangeIndex={this.handleChangeIndex}>
            <div>
            <List>
              {boughtItems}
            </List>
            </div>
            <div>
            <List>
              {myItems}
            </List>
            </div>
        </SwipeableViews>
      </div>

        {this.state.tabValue == 1 && <Fab style={{
          position: 'absolute' ,
          bottom: '65px',
          right: '10px',
          outline: 'none'
        }} color='secondary' onClick={this.addFile}>
          <AddIcon />
        </Fab>}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(MyFiles)
