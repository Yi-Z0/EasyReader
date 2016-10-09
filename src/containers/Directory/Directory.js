//@flow
import React from 'react';
import {View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import {fetchListFromDB,fetchListFromNetwork,updateListOrder,updateLastRead} from '../../ducks/directory';
import {getArticlesFromUrl} from '../../parser';
import List from './Components/List';

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
      this.props.novel.starAt = new Date();
      this.forceUpdate();
    });
  }
  
  handleSwitchOrder = ()=>{
    this.props.updateListOrder();
  }
  
  handleClickArticle = (article:Article,rowIndex:number)=>{
    let index = parseInt(rowIndex);
    if(this.props.params.get('order') == 'desc'){
      index = this.props.params.get('directory').size - index -1;
    }
    
    realmFactory().write(()=>{
      this.props.novel.lastReadIndex = index;
      this.props.novel.lastReadTitle = article.get('title');
      this.props.updateLastRead(index);
      this.forceUpdate();
    });
    
    Actions.reader({
      novel:this.props.novel,
      directory:this.props.params.get('directory'),
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
    if(props.params.get('order') == 'desc'){
      return props.params.get('directory').size-props.params.get('lastReadIndex')-3;
    }else{
      return props.params.get('lastReadIndex');
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps.params.get('lastReadIndex'));
  //   if (
  //     nextProps.params.get('directory') !== this.props.params.get('directory')||
  //     nextProps.params.get('order') !== this.props.params.get('order') ||
  //     nextProps.params.get('lastReadIndex') !== this.props.params.get('lastReadIndex') 
  //   ) {
  //     
  //     
  //     return false;
  //   }
  //   
  //   return true;
  // }
  // 
  componentWillReceiveProps(nextProps) {
    if( nextProps.params.get('lastReadIndex')!=this.props.params.get('lastReadIndex')){
      let index = this.getCurrentScrollIndex(nextProps);
      if(Math.abs(index-this.lastScrollIndex)>=5){
        this.scrollTo(index);
      }
    }
  }
  
  _scrollView;
  render() {
    let content;
    let arrowLabel = '正序';
    if (this.props.params.get('fetching')) {
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
      let directory = this.props.params.get('directory');
      if (this.props.params.get('order') == 'desc') {
        directory = directory.reverse();
        arrowLabel = '逆序';
      }

      content = <List 
      scrollRef={_scrollView=>this._scrollView=_scrollView} 
      items={directory}
      handleClickArticle={this.handleClickArticle}
      id={this.props.novel.directoryUrl}
      />
    }
    
    let starIcon = "star-o";
    if(this.props.novel.star){
      starIcon = "star";
    }
    return (
      <Container
      loading={false}
      >
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
    params : state.get('directory')
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