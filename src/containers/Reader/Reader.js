//@flow
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  RefreshControl,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import {
  Container,
  Navbar
} from 'navbar-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { parseArticleContent } from '../../parser';
import { updateLastRead } from '../../ducks/directory';
import parseContent from '../../utils/parseContent';

//在切换页面的时候,发送通知,切换index
type Props = {
  novel: Novel,
  directory: Array<Article>,
  index: number, // start
};

class Reader extends React.Component {
  realm: Realm;
  props: Props;
  state: {
    index: number,//current
    refetch: number,
    fetching: bool,
    fontSize: number,
    lines:Array<string>,
    page:number,
    showSetting:bool,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      index: parseInt(props.index),
      refetch: 0,
      fetching: true,
      fontSize: 26,
      lines:[],
      page:1,
      showSetting:false,
    };
    this.realm = realmFactory();
  }

  fetchContent = (index: number, refresh: bool = false) => {
    let article: Article = this.props.directory.get(index);
    if (!article) {
      return;
    }
    this._isMounted && this.setState({
      fetching: true,
      index
    });

    this.realm.write(() => {
      this.props.novel.lastReadIndex = index;
      this.props.novel.lastReadTitle = article.get('title');
    });


    parseArticleContent(this.props.novel.directoryUrl, article.get('url'), refresh).then((content: string) => {
      var {height, width} = Dimensions.get('window');
      lineWidth = Math.floor((width - 40) * 2 / this.state.fontSize);
      let lines = parseContent(content, lineWidth);
      lines.unshift(article.get('title')+"\n");
      this._isMounted && this.setState({
        fetching: false,
        page:1,
        lines,
        index
      });
    }).done(() => {
      //load more data
      for (var i = 1; i <= 5; i++) {
        if (this.props.directory.get(index + i)) {
          parseArticleContent(this.props.novel.directoryUrl, this.props.directory.getIn([index + i, 'url'])).catch(e => {
            console.log(e);
          });
        }
      }
    });


  }

  componentDidMount() {
    this.fetchContent(this.state.index);
  }

  handleGotoArticle = (index: number) => {
    this.props.updateLastRead(index);
    this.fetchContent(index);
  }
  
  get numbersOfLinesPerPages(){
    let {height, width} = Dimensions.get('window');
    let margin = 20;
    height -= margin*2;
    let lineHeight = this.state.fontSize + 15;
    return Math.floor(height/lineHeight);
  }

  get linesOfCurrentPage(){
    let numbersOfLinesPerPages = this.numbersOfLinesPerPages;
    let linesStart = (this.state.page-1)*numbersOfLinesPerPages;
    let content = this.state.lines.slice(linesStart,linesStart+numbersOfLinesPerPages);
    return content;
  }

  get pageCount(){
    let numbersOfLinesPerPages = this.numbersOfLinesPerPages;
    return Math.ceil(this.state.lines.length*1.0/this.numbersOfLinesPerPages)
  }

  handleContentClick = (e)=>{
    console.log(e.nativeEvent);
    if(this.state.showSetting){
      this.setState({
        showSetting:false
      });
      return ;
    }
    var {pageX,pageY} = e.nativeEvent;
    var {height, width} = Dimensions.get('window');
    if(pageY>height/3 && pageY<height*2/3 
    && pageX>width/3 && pageX<width*2/3
    ){
      //show/hide navbar
      this.setState({
        showSetting:true
      });
      return ;
    }else if(pageX<width/2){
      if(this.state.page == 1){
        if(this.state.index-1>0){
          this.handleGotoArticle(this.state.index-1);
        }
      }else{
        this.setState({
          page:this.state.page-1
        });
      }
      
    }else{
      if(this.pageCount == this.state.page){
        if(this.state.index+1<=this.directory.length){
          this.handleGotoArticle(this.state.index+1);
        }
      }else{
        this.setState({
          page:this.state.page+1
        });
      }
    }


    
  }
  render() {
    var {height, width} = Dimensions.get('window');
    let current = this.props.directory.get(this.state.index);
    if (current) {

      let content,loading = false;
      if(this.state.fetching){
        loading={
          styleContainer:{
            marginTop:64
          }
        }
      }else{
        let style={
          fontSize: this.state.fontSize,
          lineHeight: Math.ceil(this.state.fontSize +15),
          fontWeight: '300',
        },
        content = (<View style={{
          flex:1,
          flexDirection:'column',
          height,
          width,
          paddingHorizontal:20,
          justifyContent:'space-between'
        }}>
          <View onPress={this.handleContentClick} style={{
            paddingTop:40,
            paddingBottom:0,
            flexGrow:1,
            backgroundColor:'red',
            width,
            height,            
          }}>{this.linesOfCurrentPage.map((val,rowID)=>{
            return (<Text key={rowID} style={style}>{val}</Text>);
          })}
          </View>
          <Text style={{
            height:20,
            flexGrow:0,
            lineHeight:20,
            color:'gray'
          }}>{this.state.page}/{this.pageCount}</Text>
        </View>);
      }
      return (
        <Container
        type="plain"
        style={{
          backgroundColor: '#9FB2A1',
          position:'absolute',
          top:0,
          height,
          width
        }}>
          <Navbar
            title={current.get('title')}
            left={{
              icon: "ios-arrow-back",
              label: "返回",
              onPress: Actions.pop
            }}
            right={{
              label: "刷新",
              onPress: e => {
                this.fetchContent(this.state.index, true);
              }
            }}
            style={{
              marginTop:this.state.showSetting?0:-64,
            }}
            />
          {content}
        </Container>
      );
    } else {
      return (
        <Container>
          <Navbar
            title="没有下一章了"
            left={{
              icon: "ios-arrow-back",
              label: "返回",
              onPress: Actions.pop
            }}
            />
          <Text>没有更多内容了</Text>
        </Container>
      );
    }
  }

  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLastRead: bindActionCreators(updateLastRead, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader);