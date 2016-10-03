//@flow
import React from 'react';
import {View,Text,ListView} from 'react-native';
import Spinner from 'react-native-spinkit';
import SGListView from 'react-native-sglistview';
import {parseArticleContent} from '../../../parser';

type Props = {
  url:string,
  directoryUrl:string,
  refetch:number
};
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class Article extends React.Component {
  props:Props
  state: {
    fetching:bool,
    dataSource:ListView.DataSource|null,
  };
  
  constructor(props:Props) {
    super(props);
    this.state = {
      fetching:true,
      dataSource:null,
    };
  }
  
  fetchContent = (url)=>{
    this._isMounted&&this.setState({
      fetching:true
    });
    parseArticleContent(url).then((content:string)=>{
      this._isMounted&&this.setState({
        fetching:false,
        dataSource: ds.cloneWithRows(content.split('\r\n')),
      });
    }).catch((e)=>{
      console.log(e);
    });
  }
  componentDidMount() {
    if (this.state.fetching) {
      this.fetchContent(this.props.url);
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.url != this.props.url
    ||nextProps.refetch>this.props.refetch) {
      this.fetchContent(nextProps.url);
    }
  }
  
  render() {
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
      //将内容分成多个数组来显示
      content = <SGListView
        initialListSize={10000}
        stickyHeaderIndices={[]}
        onEndReachedThreshold={1}
        scrollRenderAheadDistance={1}
        pageSize={1}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text style={{
          fontSize:20,
          lineHeight:30,
        }}>{rowData}</Text>}
      />
    }
    
    return content;
  }
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }

}

export default Article;