import React from 'react';
import { connect } from 'react-redux';
import Providers from './../../DataProvider';

class FileView extends React.Component {

    state = {
        hasAccess: false
    }

    constructor(props) {
        super(props);

        this.dataProvider = Providers.dataProvider;

        try {
            const { params: { address } } = this.props.match;
            this.checkFileStatus(address);
        } catch (e) {

        }
    }

    checkFileStatus = async (address) => {
        const status = await this.dataProvider.getAccessStatus(address);
        if (status) {
            const fileData = await this.dataProvider.getData(address);
            console.log(fileData);
        }
    }

    render() {
        return (
        <div>
            FileView
        </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(FileView)
