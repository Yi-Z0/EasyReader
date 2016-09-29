//@flow
import React from 'react';
import {View,Text} from 'react-native';
import { ListView } from 'realm/react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';

import rules from '../../rules';

type Props = {
  novel:Novel|null,
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.url != r2.url});

export default class Directory extends React.Component {
  props: Props;
  state: {
    fetching: boolean,
    error:string,
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      fetching:true,
      error:'',
    };
  }
  
  componentWillMount() {
    if (this.props.novel) {
      
    }
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
      // content = <List ds={ds.cloneWithRows(this.state.novels)}/>;
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
