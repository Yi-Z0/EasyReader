//@flow
import React from 'react';
import {View,Text,TouchableWithoutFeedback,ListView} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

// import {Novel} from 'novel-parser';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
export default class Bookshelf extends React.Component {
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

  render() {
    return (
      <View style={{
        flex: 1,
        marginTop:64
      }}>
      <Text>123</Text>
      </View>
    );
  }

}
