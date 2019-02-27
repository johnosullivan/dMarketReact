import React from 'react';
import { connect } from 'react-redux';

class Home extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.dmarket;
}
export default connect(mapStateToProps)(Home)
