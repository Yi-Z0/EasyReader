//@flow
import React from 'react';
import {View,Text,ListView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';

import Form from './components/Form';
import List from './components/List';

type Props = {
  
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});

export default class Search extends React.Component {
  props: Props;
  state: {
    searching: boolean,
    error: string,
    novels:Novel[],
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      searching:false,
      error:'',
      novels:[],
    };
  }
  
  handleSearch = (keywords:string)=>{
    console.log(keywords);
  }
  
  render() {
    let content;
    if (this.state.searching) {
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
      content = <List ds={ds.cloneWithRows(this.state.novels)}/>;
    }
    
    return (
      <View style={{
        flex: 1,
        marginTop:64
      }}>
      <Form onSubmit={this.handleSearch}/>
      {content}
      </View>
    );
  }

}
