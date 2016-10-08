//@flow
import React from 'react';
import {View,Text,TouchableWithoutFeedback,StyleSheet,ScrollView} from 'react-native';
import { List,ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListView } from 'realm/react-native';

import {fetch} from '../ducks/bookshelf';

let styles = StyleSheet.create({
  rowItem: {
    marginVertical: 10,
    marginHorizontal:10,
  },
  rowTitle: {
    fontSize:24,
  },
  rowSubTitle:{
    color:'#666666'
  }
});
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
class Bookshelf extends React.Component {
  componentWillMount() {
    this.props.fetch();
  }
  renderRow(novel:Novel,sectionID,rowID){
    return <ListItem
        key={sectionID}
        component={()=>{
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
            <TouchableWithoutFeedback onPress={e=>{
              Actions.directory({novel:novel})
            }}>
            <View style={styles.rowItem}>
            <Text style={styles.rowTitle}>{novel.title}</Text>
            {lastArticleText}
            {lastReadText}
            <Text 
            style={styles.rowSubTitle}
            numberOfLines={1}>来源 : {novel.directoryUrl}</Text>
          </View>
          </TouchableWithoutFeedback>
          );
        }
        }
      />;
  }
  render() {
    let starList,unstarList;
    if(this.props.starDataSource.getRowCount()){
      starList = (
        <View>
        <Text style={{
        fontSize:24,
        fontWeight:'300',
        marginTop:20,
        marginBottom:-10
      }}>收藏列表</Text>
      <ListView
        enableEmptySections={true}
        dataSource={this.props.starDataSource}
        renderRow={this.renderRow}
      />
    </View>);
    }

    if(this.props.unstarDataSource.getRowCount()){
      unstarList = (
        <View>
        <Text style={{
        fontSize:24,
        fontWeight:'300',
        marginTop:20,
        marginBottom:-10
      }}>未收藏列表</Text>
        <ListView
          enableEmptySections={true}
          dataSource={this.props.unstarDataSource}
          renderRow={this.renderRow}
        />
    </View>);
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
          />
          <ScrollView>
          {starList}
          {unstarList}
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
    fetch: bindActionCreators(fetch, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
