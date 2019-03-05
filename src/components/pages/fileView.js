import React from 'react';
import { connect } from 'react-redux';
import Providers from './../../DataProvider';

import { Button, CircularProgress } from '@material-ui/core';

class FileView extends React.Component {

    state = {
        hasAccess: false,
        address: '',
        cost: 0,
        isLoading: false
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

    render() {
        const { hasAccess, isLoading } = this.state;

        if (hasAccess) {
            return (
                <div>
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
