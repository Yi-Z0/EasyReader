//@flow
import React from 'react';
import {View,Text,ListView,ScrollView} from 'react-native';
import { ListItem } from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {fetchListFromDB,fetchListFromNetwork,updateListOrder,updateLastRead} from '../ducks/directory';
import {getArticlesFromUrl} from '../parser';

class Directory extends React.Component {
  componentWillMount() {
    this.props.fetchListFromDB(this.props.novel);
  }
  
  componentDidMount() {
    this.props.fetchListFromNetwork(this.props.novel);
    let self = this;
    setTimeout(function(){
      self.scrollTo();
    },100);
    
  }
  
  handleSwitchStar = ()=>{
    realmFactory().write(()=>{
      this.props.novel.star = !this.props.novel.star;
      this.forceUpdate();
    });
  }
  
  handleSwitchOrder = ()=>{
    this.props.updateListOrder();
  }
  
  handleClickArticle = (article:Article,rowIndex:number)=>{
    let index = parseInt(rowIndex);
    if(this.props.order == 'desc'){
      index = this.props.directory.length - index -1;
    }
    
    realmFactory().write(()=>{
      this.props.novel.lastReadIndex = index;
      this.props.novel.lastReadTitle = article.title;
      this.props.updateLastRead(index);
      this.forceUpdate();
    });
    
    Actions.reader({
      novel:this.props.novel,
      directory:this.props.directory,
      index
    });
    
  }
  
  lastScrollIndex = 0;
  scrollTo=(index = this.getCurrentScrollIndex()-5)=>{
    if(this._scrollView ){
      if(index<0){
        index = 0;
      }
      this._scrollView.scrollTo({y:index*49,animated:false});
      this.lastScrollIndex = index;
    }
  };
  
  getCurrentScrollIndex=(props = this.props)=>{
    if(props.order == 'desc'){
      return props.directory.length-props.lastReadIndex-3;
    }else{
      return props.lastReadIndex;
    }
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.lastReadIndex!=this.props.lastReadIndex){
      let index = this.getCurrentScrollIndex(nextProps);
      if(Math.abs(index-this.lastScrollIndex)>=5){
        this.scrollTo(index);
      }
    }
  }
  
  _scrollView;
  render() {
    // this.props.novel;
    let content;
    if (this.props.fetching) {
      content =  <View style={{
        flex:1,
        alignSelf:'center',
        justifyContent:'center',
      }} ><Spinner
      style={{
        marginTop:-300
      }}
      size={100}
      type="Pulse"
      color="gray"
      />
      </View>;
    }else{
      let directoryCopy = this.props.directory;
      let lastReadArticleUrl = '';
      if(this.props.order == 'desc'){
        directoryCopy = [...this.props.directory].reverse();
        
      }
      if(this.props.directory[this.props.lastReadIndex]){
        lastReadArticleUrl = this.props.directory[this.props.lastReadIndex].url;
      }

      content = 
          <ListView
            ref={_scrollView=>this._scrollView=_scrollView}
            dataSource={this.props.dataSource}
            renderRow={(rowData,sectionID,rowID) => {
              let style={};
              let key = rowData.url;
              if(rowData.url == lastReadArticleUrl){
                style.color = "#FD973C";
                key += "-selected";
              }
              return <ListItem
                  titleStyle={style}
                  key={key}
                  title={rowData.title}
                  onPress={this.handleClickArticle.bind(null,rowData,rowID)}
                />;
            }}
          />;
    }
    
    let arrowLabel = '正序';
    if(this.props.order == 'desc'){
      arrowLabel = '逆序';
    }
    
    let starIcon = "star-o";
    if(this.props.novel.star){
      starIcon = "star";
    }
    return (
      <Container>
          <Navbar
              title={this.props.novel.title}
              left={{
                  icon: "ios-arrow-back",
                  label: "返回",
                  onPress: Actions.pop
              }}
              right={[{
                  icon: starIcon,
                  iconFamily: "FontAwesome",
                  iconSize: 20,
                  onPress: this.handleSwitchStar
              },{
                  label: arrowLabel,
                  onPress: this.handleSwitchOrder
              }]}
          />
          {content}
      </Container>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  let directory = state.get('directory');
  return {
    fetching:directory.get('fetching'),
    error:directory.get('error'),
    directory:directory.get('directory'),
    order:directory.get('order'),
    lastReadIndex:directory.get('lastReadIndex'),
    directoryUrl:directory.get('directoryUrl'),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchListFromDB: bindActionCreators(fetchListFromDB, dispatch),
    fetchListFromNetwork: bindActionCreators(fetchListFromNetwork, dispatch),
    updateListOrder: bindActionCreators(updateListOrder, dispatch),
    updateLastRead: bindActionCreators(updateLastRead, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);