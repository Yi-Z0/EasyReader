//@flow
import React from 'react';
import {View,InteractionManager,Dimensions,Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import Item from './Components/Item';
import {fetchListFromDB,fetchListFromNetwork,updateListOrder,updateLastRead} from '../../ducks/directory';

class Directory extends React.Component {
  
  componentWillMount() {
    this.props.fetchListFromDB(this.props.novel);

    // MessageBarManager.registerMessageBar(this.refs.alert);
  }
  // componentWillUnmount() {
  //   // Remove the alert located on this master page from the manager
  //   MessageBarManager.unregisterMessageBar();
  // }
  componentDidMount() {
    this.props.fetchListFromNetwork(this.props.novel);

    // MessageBarManager.showAlert({
    //   title: 'Your alert title goes here',
    //   message: 'Your alert message goes here',
    //   alertType: 'success',
    //   // See Properties section for full customization
    //   // Or check `index.ios.js` or `index.android.js` for a complete example
    // });
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
    InteractionManager.runAfterInteractions(()=>{
      realmFactory().write(()=>{
        this.props.novel.lastReadIndex = index;
        this.props.novel.lastReadTitle = article.get('title');
        this.props.updateLastRead(index);
        this.forceUpdate();
      });
    });
    
    
    Actions.reader({
      novel:this.props.novel,
      directory:this.props.params.get('directory'),
      index
    });
    
  }
  
  lastScrollIndex = 0;
  scrollTo=(index)=>{
    if(this._scrollView ){
      if(index<0){
        index = 0;
      }
      InteractionManager.runAfterInteractions(() => {
        if(this._scrollView.scrollTo){
          var {height, width} = Dimensions.get('window');
          var rowMargin = height/49/2 - 2;
          if (index>rowMargin) {
            index -= rowMargin;
          }
          this._scrollView.scrollTo({y:index*49,animated:false});
        }
      });
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.novel.directoryUrl!=this.props.novel.directoryUrl) {
      this.props.fetchListFromDB(nextProps.novel);
    }else if( nextProps.params.get('lastReadIndex')!=this.props.params.get('lastReadIndex')){
      let index = this.getCurrentScrollIndex(nextProps);
      if(Math.abs(index-this.lastScrollIndex)>=5){
        this.scrollTo(index);
      }
    }
  }
  
  _scrollView;
  render() {
    let self = this;
    let arrowLabel = '正序';
    let containerParams = {};

    if (this.props.params.get('fetching')) {
      containerParams.loading={
        styleContainer:{
          // marginTop:Platform.OS == 'ios'?64:40,
          backgroundColor:'rgba(102,102,102,.5)'
        },
        coverNavbar:false
      }
      containerParams.data = [];
    }else{

      let directory = this.props.params.get('directory');
      if (this.props.params.get('order') == 'desc') {
        directory = directory.reverse();
        arrowLabel = '逆序';
      }
      containerParams.data=directory.toArray();
    }

    containerParams.row= (rowData,_,rowID)=>{
      return <Item onPress={self.handleClickArticle.bind(null,rowData,rowID)} item={rowData}/>;
    }
    containerParams.type="list";
    containerParams.enableEmptySections=true;
    containerParams.initialListSize=30;
    containerParams.pageSize=0;
    containerParams.onEndReachedThreshold=0;
    containerParams.scrollRenderAheadDistance=1000;
    containerParams.contentRef = (_scrollView)=>{
      this._scrollView=_scrollView
    };
    
    let starIcon = "star-o";
    if(this.props.novel.star){
      starIcon = "star";
    }
    return (
      <Container
      {...containerParams}
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