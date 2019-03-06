import React from 'react';
import { connect } from 'react-redux';
import Providers from './../../DataProvider';

import { 
    Button, 
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    Grid
 } from '@material-ui/core';

 import { Done } from '@material-ui/icons';

class FileView extends React.Component {

    state = {
        hasAccess: false,
        address: '',
        cost: 0,
        isLoading: false,
        alertOpened: true,
    }

    constructor(props) {
        super(props);

        this.dataProvider = Providers.dataProvider;

        try {
            const { params: { address } } = this.props.match;
            this.checkFileStatus(address);
        } catch (e) {
            console.error(e);
        }
    }

    checkFileStatus = async (address) => {
        // Checks the access status of the metamask address
        const status = await this.dataProvider.getAccessStatus(address);
        if (status) {
            // Grabs the fileData
            const fileData = await this.dataProvider.getData(address);
            this.setState({ hasAccess: true, address });
        } else {
            // Grabs the cost of the file in dPUB
            const cost = await this.dataProvider.tokenPrice(address);
            this.setState({ hasAccess: false, address, cost });
        }
    }

    buy = async () => {
        const { hasAccess, address, cost } = this.state;
        if (!hasAccess) {
            try {
                // Creates the approve for the token transfer
                const hashApprove = await this.dataProvider.approve(address, cost);
                // Starts the animation of the spinner
                this.setState({ isLoading: true });
                // Waits for the transaction to the completed
                const receiptApprove = await this.dataProvider.transactionReceipt(hashApprove);
                // Creates the buy hash for the file
                const hashBuy = await this.dataProvider.buy(address);
                // Waits for the transaction to the completed
                const receiptBuy = await this.dataProvider.transactionReceipt(hashBuy);
                // Stops the animation of the spinner
                this.setState({ isLoading: false });
            } catch (e) {
                console.error(e);
            }
        }
    }

    handleClose = () => {
        this.setState({ alertOpened: false });
    };

    render() {
        const { hasAccess, isLoading, alertOpened, address } = this.state;


        const classes = {
            root: {
              flexGrow: 1,
            },
            paper: {
              textAlign: 'center',
            },
          };


        if (hasAccess) {
            return (
                <div>
                    <Dialog
          open={alertOpened}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Purchase: Are you sure? "}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you would like to purchase file? If not please cancel this operation below. If so, please select "Buy" below. To have a successful file purchase there will be two transactions. The first one is an approval for the file smart contract to withdrawl funding from your account (like a hold on a credit card). The next transaction will transfer the funds and enable access to the requested file.   
            </DialogContentText>
            <br/>

            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={11}>
                        <Typography color="textSecondary">
                            <a href="">0x593689853d01b7940901571dd67ea6e2a0cf4121605494d47b2f7becc08fec1f</a>
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                         <Done style={{ color: '#a0db8e' }}/>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography color="textSecondary">
                            <a href="">0x30db2dffea3c9b70f1fa08ddc12fdff3d4828d2073ab29acc2da7395f0703763</a>
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <CircularProgress size={14}/>
                    </Grid>
                </Grid>
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
                Buy
            </Button>
          </DialogActions>
        </Dialog>
                    FileView View
                </div>
            );
        } else {
            return (
                <div>
                    <br/>
                    <Button variant="contained" color="secondary" onClick={this.buy}>
                        Buy
                    </Button>
                    <br/>
                    <br/>
                    {isLoading && <CircularProgress size={24}/>}
                </div>
            );
        }
    }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(FileView)
