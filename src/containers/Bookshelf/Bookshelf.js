//@flow
import React from 'react';
import {View,TouchableWithoutFeedback} from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListView } from 'realm/react-native';

import {fetch} from '../../ducks/bookshelf';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
class Bookshelf extends React.Component {
  componentWillMount() {
    this.props.fetch();
  }
  render() {
    return (
      <Container>
          <Navbar
              title="易读小说"
              right={{
                  icon: 'ios-search',
                  iconSize: 20,
                  onPress: Actions.search
              }}
          />
          <ListView
            enableEmptySections={true}
            dataSource={this.props.dataSource}
            renderRow={(rowData,sectionID,rowID) => {
              return <ListItem
                  onPress={e=>{
                    Actions.directory({novel:rowData})
                  }}
                  key={sectionID}
                  title={rowData.title}
                />;
            }}
          />
      </Container>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    dataSource: ds.cloneWithRows(state.bookshelf.novels),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetch: bindActionCreators(fetch, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
