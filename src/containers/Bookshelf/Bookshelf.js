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
} from 'react-native';
import { List,ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListView } from 'realm/react-native';
import { Button } from 'react-native-elements'

import Row from './Components/Row';
import {fetch} from '../../ducks/bookshelf';
import {fetchListFromDB} from '../../ducks/directory';

let styles = StyleSheet.create({
  listTitle:{
    fontSize:24,
    fontWeight:'300',
    marginTop:20,
    marginBottom:10,
  },
  titleView:{
    borderBottomWidth: 1,
    borderColor:'#cccccc'
  }
});

let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
class Bookshelf extends React.Component {
  componentWillMount() {
    this.props.fetch();
  }

  deleteNovel = (novel)=>{
    InteractionManager.runAfterInteractions(()=>{
      let realm = realmFactory();
      realm.write(()=>{
        let directoryUrl = novel.directoryUrl;
        realm.delete(novel);

        let allArticles = realm.objects('Article').filtered(`directoryUrl="${directoryUrl}"`)
        realm.delete(allArticles); // Deletes all articles
      });
    })

  }
  renderRow = (novel:Novel,sectionID,rowID)=>{
    return (<Row
      novel={novel}
      onPress={e=>{
        this.props.fetchListFromDB(novel);
        Actions.directory({novel:novel});
      }}
      onDelete={this.deleteNovel.bind(null,novel)}
      />);
  }

  renderListView=(starDataSource,title)=>{
    return (<View key={title}>
          <View style={styles.titleView}>
            <Text style={styles.listTitle}>{title}</Text>
          </View>
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
