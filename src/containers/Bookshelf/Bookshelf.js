//@flow
import React from 'react';
import {View,Text,TouchableWithoutFeedback} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

import { ListView } from 'realm/react-native';

type Props = {
  
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
export default class Bookshelf extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    novels:Novel[],
  };
  
  static renderSearchBTN(){
    return (
      <TouchableWithoutFeedback  onPress={e=>{
        Actions.search();
      }}>
        <Icon style={{
          position:'absolute',
          right:10,
          bottom:10
        }} size={25} name="ios-search-outline" color="#666666"/>
      </TouchableWithoutFeedback>
    )
  }
  
  constructor(props:Props){
    super(props);
    this.realm = realmFactory();
    this.state = {
      novels: ds.cloneWithRows(this.realm.objects('Novel')),
    };
    this.realm.addListener('change', () => {
      this.setState({
        novels:ds.cloneWithRows(this.realm.objects('Novel')),
      })
    });
  }
  
  componentWillUnmount(){
    this.realm.removeAllListeners();
  }

  handleNewData=()=>{
    this.realm.write(() => {
     this.realm.create('Novel', {
       title:'title',
       directoryUrl:'directoryUrl'+Date.now(),
       isParseDirectory:false,
       logo:'logo',
       directory:[],
       author:'author',
       desc:'desc',
       score:99,
     });
    });
  }
  render() {
    return (
      <View style={{
        flex: 1,
        marginTop:64
      }}>
      <Text onPress={this.handleNewData}>新增数据</Text>
      
      <ListView
        enableEmptySections={true}
        dataSource={this.state.novels}
        renderRow={(rowData) => <Text>{rowData.directoryUrl}</Text>}
      />
      </View>
    );
  }

}
