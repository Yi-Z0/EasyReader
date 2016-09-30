//@flow
import React from 'react';
import {View,Text,ListView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';

import {getArticlesFromUrl} from '../../parser';
import Row from './Components/Row';

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
    desc:bool,
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      fetching:true,
      error:'',
      dataSource:null,
      desc:false
    };
    this.realm = realmFactory();
  }
  
  componentWillMount() {
    this.props.navigationState.title = this.props.novel.title;
    if (this.props.novel.isParseDirectory) {
      this.setState({
        fetching:false,
        dataSource:ds.cloneWithRows(JSON.parse(this.props.novel.directory)),
      });
    }
    
    getArticlesFromUrl(this.props.novel.directoryUrl).then((directory)=>{
      this.realm.write(()=>{
        this.props.novel.directory = JSON.stringify(directory);
        this.props.novel.isParseDirectory = true;
        this._isMounted && this.setState({
          fetching:false,
          dataSource:ds.cloneWithRows(directory),
        });
      });
    })
      
  }
  
  handleClick(id:number){
    console.log(id);
  }
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }
  
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
      content = <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData,sectionID,rowID) => {
            return <Row onPress={this.handleClick} {...rowData} id={rowID}/>;
        }}
      />;
    }
    
    return (
      <View style={{
        flex: 1,
        marginTop:64
      }}>
      {content}
      </View>
    );
  }

}
