//@flow
import React from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  ScrollView,
  InteractionManager,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { List,ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListView } from 'realm/react-native';
import { Button } from 'react-native-elements';

import Row from './Components/Row';
import {fetch,refreshAllNovel} from '../../ducks/bookshelf';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
class Bookshelf extends React.Component {
  state={
    refreshing:false
  }
  componentWillMount() {
    this.props.fetch();
  }

  deleteNovel = (novel)=>{
    InteractionManager.runAfterInteractions(()=>{
      let realm = realmFactory();
      realm.write(()=>{
        
        novel.active=false;
        let directoryUrl = novel.directoryUrl;
        let allArticles = realm.objects('Article').filtered(`directoryUrl="${directoryUrl}"`)
        realm.delete(allArticles); // Deletes all articles

      });

    });

  }
  renderRow = (novel:Novel,sectionID,rowID)=>{
    return (<Row
      novel={novel}
      onPress={e=>{
        Actions.directory({novel:novel});
      }}
      onDelete={this.deleteNovel.bind(null,novel)}
      />);
  }

  render() {

    let searchBtn;
    if (!this.props.starDataSource.getRowCount()) {
      searchBtn = <Button
            raised
            onPress={Actions.search}
            icon={{
              name: 'ios-search',
              type: 'ionicon'
            }}
            title='输入书名,作者,主角等进行搜索' />;
    }

    return (
      <Container
      type="plain"
      >
          <Navbar
              title="易读小说"
              right={{
                  icon: 'ios-search',
                  iconSize: 20,
                  onPress: Actions.search
              }}
              left={{
                label:" "
              }}
          />
            {searchBtn}
            <ListView
            style={{
              height:Dimensions.get('window').height - (Platform.OS=='ios'?64:40)
            }}
            
            refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  tintColor="#666667"
                  title="加载中..."
                  titleColor="#666666"
                  colors={['#666667', '#666666', '#0000ff']}
                  progressBackgroundColor="#ffff00"
                  onRefresh={e=>{
                    this.setState({
                      refreshing:true
                    });
                    refreshAllNovel(()=>{
                      this.setState({
                        refreshing:false
                      });
                    });
                  }}
                />
              }
              enableEmptySections={true}
              dataSource={this.props.starDataSource}
              renderRow={this.renderRow}
            />
      </Container>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    starDataSource: ds.cloneWithRows(state.get('bookshelf').starNovels),
    unstarDataSource: ds.cloneWithRows(state.get('bookshelf').unstarNovels),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetch: bindActionCreators(fetch, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
