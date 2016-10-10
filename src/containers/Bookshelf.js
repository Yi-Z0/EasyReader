//@flow
import React from 'react';
import {View,Text,Animated,
    Easing,StyleSheet,ScrollView} from 'react-native';
import { List,ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListView } from 'realm/react-native';
import { Button } from 'react-native-elements'
import { SwipeRow } from 'react-native-swipe-list-view';


import {fetch} from '../ducks/bookshelf';
import {fetchListFromDB} from '../ducks/directory';

let styles = StyleSheet.create({
  rowItem: {
    padding:10,
    backgroundColor:'#ffffff'
  },
  rowTitle: {
    fontSize:24,
  },
  rowSubTitle:{
    color:'#666666'
  },
  listTitle:{
    fontSize:24,
    fontWeight:'300',
    marginTop:20,
    marginBottom:10,
  },

  swipeView:{
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor:'red',
  },
  deleteBtn:{
    color:"#ffffff"
  }
});

let styleSwipeRow = {
    borderBottomWidth: 1,
    borderColor:'#cccccc'
  };
let styleSwipeFirstRow = {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor:'#cccccc'
  };
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
class Bookshelf extends React.Component {
  componentWillMount() {
    this.props.fetch();
  }

  deleteNovel = (novel)=>{
    console.log(novel,'will be delete');
    let realm = realmFactory();
    realm.write(()=>{
      let directoryUrl = novel.directoryUrl;
      realm.delete(novel);

      let allArticles = realm.objects('Article').filtered(`directoryUrl="${directoryUrl}"`)
      realm.delete(allArticles); // Deletes all articles
    });

  }
  renderRow = (novel:Novel,sectionID,rowID)=>{
    let lastReadText , lastArticleText;
          if(novel.lastReadTitle){
            lastReadText = <Text
            style={styles.rowSubTitle}
            numberOfLines={1}
            >已读 : {novel.lastReadTitle}</Text>
          }
          if(novel.lastArticleTitle){
            lastArticleText = <Text
            style={styles.rowSubTitle}
            numberOfLines={1}
            >最新 : {novel.lastArticleTitle}</Text>
          }

          return (

            <SwipeRow
            style={rowID==0?styleSwipeFirstRow:styleSwipeRow}
            disableRightSwipe
            rightOpenValue={-65}
            onRowPress={e=>{
              this.props.fetchListFromDB(novel);
              Actions.directory({novel:novel});
            }}
          >
            <View style={styles.swipeView}>
              <Text></Text>
              <Text onPress={this.deleteNovel.bind(null,novel)} style={styles.deleteBtn}>删除</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowTitle}>{novel.title}</Text>
              {lastArticleText}
              {lastReadText}
              <Text 
              style={styles.rowSubTitle}
              numberOfLines={1}>来源 : {novel.directoryUrl}</Text>
            </View>
          </SwipeRow>

            
          );
  }

  renderListView=(starDataSource,title)=>{
    return (<View key={title}>
            <Text style={styles.listTitle}>{title}</Text>
          <ListView
            enableEmptySections={true}
            dataSource={starDataSource}
            renderRow={this.renderRow}
          />
        </View>)
  }
  render() {
    let lists = [];
    if(this.props.starDataSource.getRowCount()){
      lists.push(
        this.renderListView(this.props.starDataSource,'收藏列表')
      );
    }

    if(this.props.unstarDataSource.getRowCount()){
      lists.push(
        this.renderListView(this.props.unstarDataSource,'已读列表')
      );
    }

    let searchBtn;
    if (lists.length==0) {
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
      <Container>
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
          <ScrollView>
          {lists}
          </ScrollView>
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
    fetchListFromDB: bindActionCreators(fetchListFromDB, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
