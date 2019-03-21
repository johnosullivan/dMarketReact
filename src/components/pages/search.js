import React from 'react';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js'

class Search extends React.Component {

  /*constructor(props) {
    super(props);
  }*/

  componentWillMount() {
    console.log('');
    PubSub.publish('SET_TITLE', 'Search');
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
export default connect(mapStateToProps)(Search)
