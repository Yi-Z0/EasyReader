//@flow
import React from 'react';
import {View,ListView} from 'react-native';
// import { ListView } from 'realm/react-native';
import Spinner from 'react-native-spinkit';

import {Master} from '../../parser';

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
    keywords:string,
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      searching:false,
      error:'',
      novels:[],
      keywords:'',
    };
  }
  
  handleSearch = (keywords:string)=>{
    this.setState({
      searching:true,
      novels:[],
      error:'',
      keywords
    });
    
    let master = new Master();
    
    master.search(keywords,(novel)=>{
      //TODO check this is mount before setState
      if (keywords == this.state.keywords) {
        this._isMounted && this.setState({
          searching:false,
          novels:[...this.state.novels,novel]
        });
      }
    }).then((data)=>{
      console.log('finished');
    }).catch((error)=>{
      this._isMounted && this.setState({
        searching:false,
        error
      });
    });
  }
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
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
