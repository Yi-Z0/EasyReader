//@flow
import React from 'react';
import {View,Text,TouchableWithoutFeedback} from 'react-native';

import {Actions} from 'react-native-router-flux';

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
        <Text>Search</Text>
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
    
  }
  render() {
    return (
      <View style={{
        flex: 1,
        marginTop:64
      }}>
      <Text onPress={this.handleNewData}>DOOOOOO</Text>
      
      <ListView
        enableEmptySections={true}
        dataSource={this.state.novels}
        renderRow={(rowData) => <Text onPress={e=>{
          Actions.directory({novel:rowData})
        }} style={{
          marginVertical:10
        }}>{rowData.title}</Text>}
      />
      </View>
    );
  }

}
