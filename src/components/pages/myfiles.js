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


class MyFiles extends React.Component {

  state = {
    fileName: '',
    title: '',
    version: '',
    fileAuthor: '',
    description: '',
    price: '',
    file: [],
    isAdding: false
  };

  constructor(props) {
    super(props);


    this.dataProvider = Providers.dataProvider;
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
        fileAuthor, description,
        price
    };

    const res = await this.dataProvider.addFile(file[0], details);

    console.log('Submit');
    console.log(this.state);
    console.log(res);
  };

  render() {
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
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(MyFiles)
