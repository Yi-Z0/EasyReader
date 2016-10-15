//@flow
import React from 'react';
import {View,InteractionManager} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Item from './Components/Item';
import {fetchListFromNetwork,updateListOrder,updateLastRead} from '../../ducks/directory';

class Directory extends React.Component {
  
  componentDidMount() {
    this.props.fetchListFromNetwork(this.props.novel);
    this.scrollTo();
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
      InteractionManager.runAfterInteractions(() => {
        this._scrollView.scrollTo({y:index*49,animated:false});
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
    if( nextProps.params.get('lastReadIndex')!=this.props.params.get('lastReadIndex')){
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
    let loading = false;
    let containerParams = {};

    if (this.props.params.get('fetching')) {
      containerParams.loading={
        styleContainer:{
          marginTop:64
        }
      }
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
    containerParams.initialListSize=100;
    containerParams.pageSize=200;
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
    fetchListFromNetwork: bindActionCreators(fetchListFromNetwork, dispatch),
    updateListOrder: bindActionCreators(updateListOrder, dispatch),
    updateLastRead: bindActionCreators(updateLastRead, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);