//@flow
import React from 'react';
import {View,Text} from 'react-native';

class Row extends React.Component {
  props:{
    title:string,
    url:string,
    id:number,
    onPress:(id:number)=>void,
  };
  
  render() {
    return (
      <Text onPress={e=>{
        this.props.onPress(this.props.id)
      }}
      style={{
        marginVertical:10,
      }}
      >
      {this.props.title}
      </Text>
    );
  }

}

export default Row;