//@flow
import React from 'react';
import {View,Text,Dimensions,ListView,TouchableWithoutFeedback,PanResponder,RefreshControl} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';
import {parseArticleContent} from '../parser';
import { Button } from 'react-native-elements'


type Props = {
  novel:Novel,
  navigationState:any,
  directory:Array<Article>,
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
    fontSize:number,
    directory:Array<Article>,
  };
  
  constructor(props:Props) {
    super(props);
    this.state = {
      index:parseInt(props.index),
      refetch:0,
      navMargin:0,
      fetching:true,
      dataSource:null,
      fontSize:25,
      directory:this.props.directory,
    };
    this.realm = realmFactory();
  }
  
  fetchContent = (index:number)=>{
    let article:Article = this.props.directory[index];
    if(!article){
      return;
    }
    this._isMounted&&this.setState({
      navMargin:0,
      fetching:true
    });
    
    this.realm.write(()=>{
      this.props.novel.lastReadIndex = index;
    })

    parseArticleContent(article.url).then((content:string)=>{
      let rows = content.split('\r\n');
      
      
      let nextBTN,beforeBTN;
      if(this.props.directory[index+1]){
        nextBTN=(
          <Button
          onPress={e=>this.fetchContent(index+1)}
          title='下一章' />
        );
      }
      if(this.props.directory[index-1]){
        beforeBTN=(
          <Button
          onPress={e=>this.fetchContent(index-1)}
          title='上一章' />
        );
      }
      let btns = (<View style={{
        flex:1,
        flexDirection:"row",
        justifyContent: 'space-between',
        height:80
      }}>
        {beforeBTN}
        {nextBTN}
      </View>)
      rows.push(btns);
      
      let title = (
        <Text style={{
          fontSize:this.state.fontSize+10,
          lineHeight:this.state.fontSize+15,
        }}>{article.title+"\n"}</Text>
      );
      rows.unshift(title);
      rows.unshift(btns);
      
      this._isMounted&&this.setState({
        fetching:false,
        dataSource: ds.cloneWithRows(rows),
      });
    }).catch((e)=>{
      console.log(e);
    });
  }
  
  componentDidMount() {
    this.fetchContent(this.state.index);
  }
  
  lastContentOffsetY = 0;
  handleScroll=(e:Event)=>{
    if(e.nativeEvent.contentOffset.y>100){
      
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
    }
    
    this.lastContentOffsetY = e.nativeEvent.contentOffset.y;
  }

  
  render() {
    let current = this.state.directory[this.state.index];
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
            height:height-this.state.navMargin-64,
            padding:10,
            paddingBottom:50
          }}
          onScroll={this.handleScroll}
          onEndReached={e=>{
            this.setState({
              navMargin:0
            })
          }}
          initialListSize={10}
          onEndReachedThreshold={1}
          scrollRenderAheadDistance={1}
          pageSize={10}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            if(typeof(rowData) == "string"){
              let style = {
                fontSize:this.state.fontSize,
                lineHeight:this.state.fontSize+5,
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
