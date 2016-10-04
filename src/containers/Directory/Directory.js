//@flow
import React from 'react';
import {View,Text,ListView,ScrollView} from 'react-native';
import { ListItem } from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';

import {getArticlesFromUrl} from '../../parser';

type Props = {
  novel:Novel,
  navigationState:any,
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.url != r2.url});

export default class Directory extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    fetching: bool,
    error:string,
    dataSource:any,
    directory:array<Article>,
    desc:bool,
    lastReadArticleUrl:string,
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      fetching:true,
      error:'',
      dataSource:null,
      directory:[],
      desc:false,
      lastReadArticleUrl:''
    };
    this.realm = realmFactory();
  }
  
  componentWillMount() {
    if (this.props.novel.isParseDirectory) {
      let directory = JSON.parse(this.props.novel.directory);
      this.setState({
        fetching:false,
        dataSource:this.getDataSource(directory),
        directory,
        lastReadArticleUrl:directory[this.props.novel.lastReadIndex].url
      });
    }  
  }
  componentDidMount() {
    getArticlesFromUrl(this.props.novel.directoryUrl).then((directory)=>{
      this.realm.write(()=>{
        this.props.novel.directory = JSON.stringify(directory);
        this.props.novel.isParseDirectory = true;
        this._isMounted && this.setState({
          fetching:false,
          dataSource:this.getDataSource(directory),
          directory,
          lastReadArticleUrl:directory[this.props.novel.lastReadIndex].url
        });
      });
    });
    if(this._scrollView){
      this._scrollView.scrollTo({y:this.props.novel.lastReadIndex*49});
    }
  }
  
  getDataSource(directory:array<Article>=null,desc:bool|null=null){
    if(directory==null){
      directory = this.state.directory;
    }
    let directoryCopy = [...directory];
    if(desc == null){
      desc = this.state.desc
    }
    
    if(desc){
      directoryCopy.reverse();
    }
    return ds.cloneWithRows(directoryCopy);
  }
  
  handleSwitchStar = ()=>{
    this.realm.write(()=>{
      this.props.novel.star = !this.props.novel.star;
      this.forceUpdate();
    });
  }
  
  handleSwitchOrder = ()=>{
    let desc = !this.state.desc;
    this.setState({
      desc,
      dataSource:this.getDataSource(null,desc)
    });
  }
  
  handleClickArticle = (article:Article,rowIndex:number)=>{
    let index = parseInt(rowIndex);
    if(this.state.desc){
      index = this.state.directory.length - index -1;
    }
    this.realm.write(()=>{
      this.props.novel.lastReadIndex = index;
    });
    this.setState({
      lastReadArticleUrl:this.state.directory[index].url,
      dataSource:this.getDataSource()
    },()=>{
      Actions.reader({
        directory:this.state.directory,
        directoryUrl:this.props.novel.directoryUrl,
        index
      });
    });
    
  }
  
  _scrollView;
  render() {
    // this.props.novel;
    let content;
    if (this.state.fetching) {
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
      let lastReadArticleUrl = this.state.lastReadArticleUrl;
      content = 
          <ListView
            ref={_scrollView=>this._scrollView=_scrollView}
            dataSource={this.state.dataSource}
            renderRow={(rowData,sectionID,rowID) => {
              let style={};
              if(rowData.url == lastReadArticleUrl){
                style.color = "#FD973C";
              }
              return <ListItem
                  titleStyle={style}
                  key={rowData.url}
                  title={rowData.title}
                  onPress={this.handleClickArticle.bind(null,rowData,rowID)}
                />;
            }}
          />;
    }
    
    let arrowLabel = '正序';
    if(this.state.desc){
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
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }

}
