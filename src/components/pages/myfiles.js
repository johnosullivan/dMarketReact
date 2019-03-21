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
    myFiles: []
  };

  constructor(props) {
    super(props);


    this.dataProvider = Providers.dataProvider;
    console.log(this.dataProvider);

    this.submit();
  }

  componentWillMount() {
    PubSub.publish('SET_TITLE', 'My Files');
  }

  submit = () => {
    let self = this;
    this.dataProvider.myFiles().then(async function(data) {
        const s = await self.dataProvider.getFilePublicDetails(data[0]);
        s['address'] = data[0];
        self.setState({ myFiles: [s] });
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

  render() {
    const { myFiles = [] } = this.state;

    console.log(myFiles);

    console.log(this.props);

    const fileItems = myFiles.map((file, i) =>
        <ListItem key={i} style={{
            backgroundColor:'white'
        }}>
        <ListItemText
          primary={file.title + ' - ' + file.price + ' dPUB'}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {file.description}
              </Typography>
            </React.Fragment>
          }
        />
        <Button variant="contained" color="secondary" onClick={(event) => this.view(1, event)}>
            View
        </Button>
        </ListItem> 
    );

    return (
      <div>
        <Dialog open={this.state.isAdding} aria-labelledby="welcomd-dialog-title">
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
            </DialogActions>
        </Dialog>

        <List>
          {fileItems}
        </List>

        <Button onClick={this.submit} color="primary">
            My Files
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(MyFiles)
