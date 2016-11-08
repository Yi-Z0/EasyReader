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
import Immutable from 'immutable'
import { List,ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-native-elements';

import { SwipeListView } from 'react-native-swipe-list-view';

import Row from './Components/Row';
import {fetch,refreshAllNovel,downloadAllArticle} from '../../ducks/bookshelf';
const styles = StyleSheet.create({

  swipeView:{
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    height:100,
  },
  downloadBtn:{
    padding:10,
    backgroundColor:'green',
    right:65
  },

  deleteBtn:{
    padding:10,
    backgroundColor:'red',
    right:0
  },

  rightSwipeBtn:{
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 65,
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  swipeText:{
    color:"#ffffff",
  }
  
})

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
        ////获得指定章节,若章节获取失败,则还是进去目录页面
        if(novel.isParseDirectory){
          let directory = JSON.parse(novel.directory);

          Actions.reader({
            novel:novel,
            directory:Immutable.fromJS(directory),
            index:novel.lastReadIndex,
            needShowDir:true
          });
        }else{
          Actions.directory({novel:novel});
        }
        
      }}
      />);
  }

  render() {
    // let w = require('../../utils/stringWidth');
    // return (
    //   <View>
    //   {['国','“国'].map((d)=>{
    //     return (<Text>{d}      {w(d)}</Text>);
    //   })}
    //   </View>
    // )
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
                  <View style={styles.swipeView}>
                    <Text></Text>
                    <View style={[styles.rightSwipeBtn,styles.downloadBtn]}>
                        <View>
                            <Text onPress={e=>{
                                rowMap[`${secId}${rowId}`].closeRow();
                                this.props.downloadAllArticle(data);
                            }} style={styles.swipeText}>
                                下载
                                未读
                                章节
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.rightSwipeBtn,styles.deleteBtn]}>
                        <View>
                            <Text onPress={e=>{
                                rowMap[`${secId}${rowId}`].closeRow();
                                this.deleteNovel(data);
                            }} style={styles.swipeText}>删除</Text>
                        </View>
                    </View>
                  </View>
              )}
              disableRightSwipe={true}
              rightOpenValue={-130}
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
    downloadAllArticle: bindActionCreators(downloadAllArticle, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
