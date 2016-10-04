//@flow
import React from 'react';
import {View,Text,Dimensions,ListView,TouchableWithoutFeedback,PanResponder} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';
import {parseArticleContent} from '../../parser';

type Props = {
  directory:Array<any>,
  navigationState:any,
  directoryUrl:string,
  index:number, // start
};

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class Reader extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    index:number,//current
    refetch:number,
    navMargin:number,
    fetching:bool,
    dataSource:ListView.DataSource|null,
  };
  
  directory:Array<any>;
  constructor(props:Props) {
    super(props);
    this.state = {
      index:parseInt(props.index),
      refetch:0,
      navMargin:0,
      fetching:true,
      dataSource:null
    };
    this.realm = realmFactory();
  }
  
  fetchContent = (article:Article)=>{
    this._isMounted&&this.setState({
      fetching:true
    });

    parseArticleContent(article.url).then((content:string)=>{
      let rows = content.split('\r\n');
      // let title = (
      //   <Text style={{
      //     fontSize:40,
      //     lineHeight:45,
      //   }}>{article.title}</Text>
      // );
      // rows.unshift(title);
      this._isMounted&&this.setState({
        fetching:false,
        dataSource: ds.cloneWithRows(rows),
      });
    }).catch((e)=>{
      console.log(e);
    });
  }
  
  componentDidMount() {
    this.fetchContent(this.getCurrentArticle());
  }
  
  getCurrentArticle():Article{
    return this.props.directory[this.state.index];
  }
  
  lastContentOffsetY = 0;
  handleScroll=(e:Event)=>{
    let difference = e.nativeEvent.contentOffset.y - this.lastContentOffsetY;
    if(difference>0){
      if(this.state.navMargin>-64){
        let val = this.state.navMargin-difference<-64?-64:this.state.navMargin-difference;
        this.setState({
          navMargin:val
        });
      }
    }else{
      if(this.state.navMargin!=0){
        let val = this.state.navMargin-difference>0?0:this.state.navMargin-difference;
        this.setState({
          navMargin:val
        });
      }
    }
    
    this.lastContentOffsetY = e.nativeEvent.contentOffset.y;
  }
  
  //load next page
  handleEndReached=()=>{
    this.setState({
      navMargin:0,
      index:this.state.index+1,
      fetching:true,
    },()=>{
      this.fetchContent(this.getCurrentArticle());
    });
  }
  
  render() {
    let current = this.getCurrentArticle();
    if (current) {
      
      let content;
      if (this.state.fetching) {
        content =  <View style={{
          flex:1,
          alignSelf:'center',
          justifyContent:'center',
        }} ><Spinner
        size={100}
        type="Pulse"
        color="gray"
        />
        </View>;
      }else{
        var {height, width} = Dimensions.get('window');
        //将内容分成多个数组来显示
        content = <ListView
          style={{
            height,
            padding:10,
            paddingBottom:50
          }}
          onScroll={this.handleScroll}
          initialListSize={10}
          onEndReachedThreshold={1}
          scrollRenderAheadDistance={1}
          pageSize={10}
          onEndReached={this.handleEndReached}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => e=>{
            
            if(typeof(a) == "string"){
              let style = {
                fontSize:25,
                lineHeight:35,
              };
              return <Text style={style}>{rowData}</Text>;
            }else{
              return rowData;
            }
            
            
          }}
        />
      }
      
      return (
        <Container 
        type="scroll"
        style={{
          backgroundColor:'#9FB2A1'
        }}>
        <Navbar
        title={current.title}
        left={{
          icon: "ios-arrow-back",
          label: "返回",
          onPress: Actions.pop
        }}
        right={{
          label: "刷新",
          onPress: e=>this.setState({
            refetch:this.state.refetch+1
          })
        }}
        style={{
          marginTop:this.state.navMargin
        }}
        />
          {content}
        </Container>
      );
    }else{
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
