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
      this.props.updateLastRead(index);
      this.forceUpdate();
    });
    
    Actions.reader({
      novel:this.props.novel,
      directory:this.props.directory,
      index
    });
    
  }
  
  scrollTo=()=>{
    if(this._scrollView ){
      let index = this.props.lastReadIndex;
      if(this.props.lastReadIndex+1 >= this.props.directory.length){
        index -= 10;
      }
      this._scrollView.scrollTo({y:index*49,animated:false});
    }
  };
  componentWillReceiveProps(nextProps) {
    if( nextProps.lastReadIndex!=this.props.lastReadIndex){
      this.scrollTo();
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
console.log(lastReadArticleUrl);
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
  return {
    ...state.directory
  };
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