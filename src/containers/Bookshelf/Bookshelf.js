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
  ListView
} from 'react-native';
import { List,ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-native-elements';

import { SwipeListView } from 'react-native-swipe-list-view';

import Row from './Components/Row';
import {fetch,refreshAllNovel} from '../../ducks/bookshelf';


let swipeView = {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    height:100,
  };
let deleteBtn = {
    color:"#ffffff",
    padding:10,
    lineHeight:100,
    backgroundColor:'red',
    marginRight:-20
  }
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});

class Bookshelf extends React.Component {
  state={
    refreshing:false
  }
  componentWillMount() {
    this.props.fetch();
  }

  deleteNovel = (novel)=>{
    let realm = realmFactory();
    realm.write(()=>{
      novel.active=false;
      this.props.fetch();
    });

    InteractionManager.runAfterInteractions(()=>{
      realm.write(()=>{
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
      />);
  }

  render() {
    
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
            <SwipeListView
            swipeRowStyle={{
              borderBottomWidth: 1,
              borderColor:'#cccccc'
            }}
            style={{
              height:Dimensions.get('window').height - (Platform.OS=='ios'?64:40),
            }}
            
            renderHeader={()=>{
              if (!this.props.starDataSource.getRowCount()) {
                  return (<Button
                      raised
                      onPress={Actions.search}
                      icon={{
                        name: 'ios-search',
                        type: 'ionicon'
                      }}
                      title='输入书名,作者,主角等进行搜索' />);
                }else{
                  return (<View style={{
                    height:20,
                    borderBottomWidth: 1,
                    borderColor:'#cccccc',
                  }} />);
                }
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
              renderHiddenRow={ (data, secId, rowId, rowMap) => (
                  <View style={swipeView}>
                    <Text></Text>
                    <Text onPress={e=>{
                      rowMap[`${secId}${rowId}`].closeRow();
                      this.deleteNovel(data);
                  }} style={deleteBtn}>删除</Text>
                  </View>
              )}
              disableRightSwipe={true}
              rightOpenValue={-65}
            />
      </Container>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    starDataSource: ds.cloneWithRows(state.get('bookshelf').starNovels),
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
