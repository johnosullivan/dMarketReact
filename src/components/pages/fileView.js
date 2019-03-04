import React from 'react';
import { connect } from 'react-redux';

class FileView extends React.Component {

  constructor(props) {
    super(props);
    console.log(this);
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
