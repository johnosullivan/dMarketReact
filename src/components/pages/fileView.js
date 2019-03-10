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

import { Document, Page } from 'react-pdf';

import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const deplay = ms => new Promise(res => setTimeout(res, ms))

class FileView extends React.Component {

    state = {
        hasAccess: false,
        address: '',
        cost: 0,
        isLoading: true,
        alertOpened: false,
        approveHash: '',
        approveDone: false,
        buyHash: '',
        buyDone: false,
        waiting: false,
        file: {},
        numPages: 0,
        pageNumber: 1
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
            const fileDetails = await this.dataProvider.getData(address);

            const file = await this.dataProvider.getFile(fileDetails);
            
            this.setState({ hasAccess: true, address, file  });
        } else {
            // Grabs the cost of the file in dPUB
            const cost = await this.dataProvider.tokenPrice(address);
            this.setState({ hasAccess: false, address, cost });
        }
    }

    buyAction = () => {
        const { hasAccess } = this.state;
        if (!hasAccess) {
            this.setState({ alertOpened: true });
        }
    };

    buy = async () => {
        const { hasAccess, address, cost } = this.state;
        if (!hasAccess) {
            try {
                // Creates the approve for the token transfer
                const hashApprove = await this.dataProvider.approve(address, cost);
                // Starts the animation of the spinner
                this.setState({ isLoading: true, approveHash: hashApprove, approveDone: false });
                // Waits for the transaction to the completed
                const receiptApprove = await this.dataProvider.transactionReceipt(hashApprove);
                this.setState({ approveDone: true });
                // Creates the buy hash for the file
                const hashBuy = await this.dataProvider.buy(address);
                this.setState({ buyHash: hashBuy, buyDone: false });
                // Waits for the transaction to the completed
                const receiptBuy = await this.dataProvider.transactionReceipt(hashBuy);
                // Stops the animation of the spinner
                this.setState({ isLoading: false, buyDone: true, waiting: true, receiptBuy });
                // Start timer to update
                let status = false;
                while (!status) {
                    await deplay(2000);
                    status = await this.dataProvider.getAccessStatus(address);
                }
                this.setState({ isLoading: false, alertOpened: false, waiting: false, buyDone: false });
                this.checkFileStatus(address);
            } catch (e) {
                console.error(e);
            }
       } 
    }

    handleClose = () => {
        this.setState({ alertOpened: false });
    };

    onDocumentLoadSuccess = ({ numPages }) => {
        console.log(numPages);
        this.setState({ numPages });
    };
    
    onDocumentError = (error) => {
        console.log(error);
    };

    render() {
        const { pageNumber, numPages, hasAccess, alertOpened, approveHash, approveDone, buyHash, buyDone, waiting, file } = this.state;

        const classes = {
            root: { flexGrow: 1, },
            paper: { textAlign: 'center', }
        };

        if (hasAccess) {
            return (
                <div>
                    <Document
                        file={file}
                        onLoadError={this.onDocumentError}
                        onLoadSuccess={this.onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <br/>
                    <Button variant="contained" color="secondary" onClick={this.buyAction}>Buy</Button>
                    <br/>
                    <Dialog
                        open={alertOpened}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Purchase: Are you sure? "}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you would like to purchase file? If so, please click "Buy" below. To have a successful file purchase there will be two transactions. The first one is an approval for the file smart contract to withdrawl funding from your account (like a hold on a credit card). The next transaction will transfer the funds and enable access to the requested file. WARNING: DO NOT REFRESH THE PAGE AFTER THE PROCESS HAS STARTED   
                        </DialogContentText>
                        <br/>

                        <div className={classes.root}>
                            <Grid container spacing={24}>
                                {approveHash !== '' && 
                                    <Grid item xs={11}>
                                        <Typography color="textSecondary">
                                            <a href="">{approveHash}</a>
                                        </Typography>
                                    </Grid>}
                                {approveHash !== '' &&
                                    <Grid item xs={1}>
                                        {approveDone === true && <Done style={{ color: '#a0db8e' }}/>}
                                        {approveDone === false && <CircularProgress size={14}/>}
                                    </Grid>}
                                {buyHash !== '' &&
                                    <Grid item xs={11}>
                                        <Typography color="textSecondary">
                                            <a href="">{buyHash}</a>
                                        </Typography>
                                    </Grid>}
                                {buyHash !== '' &&
                                    <Grid item xs={1}>
                                        {buyDone === true && <Done style={{ color: '#a0db8e' }}/>}
                                        {buyDone === false && <CircularProgress size={14}/>}
                                    </Grid>}
                                {waiting && <Grid item xs={11}>
                                        <Typography color="textSecondary">
                                            Waiting for blockchain to reflect the changes...  
                                        </Typography>
                                    </Grid>}
                                {waiting && <Grid item xs={1}>
                                        <CircularProgress size={14}/>
                                    </Grid>}
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.buy} color="primary">
                            Buy
                        </Button>
                    </DialogActions>
                    </Dialog>
                    <br/>
                </div>
            );
        }
    }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(FileView)
