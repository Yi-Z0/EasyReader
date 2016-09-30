//@flow
import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  Text,
  TextInput
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';

export default class Form extends Component {
  props: {
    onSubmit:(keywords:string)=>void
  };
  submit:()=>void = ()=>{
    dismissKeyboard();
    this.props.onSubmit(this.refs.keywords._lastNativeText);
  };
  render() {
    return ( <View style = {{
          flex: 0,
          marginTop:10,
          paddingHorizontal:15,
        }} >
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#eeeeee',
          paddingVertical: 2,
          borderRadius: 6,
          overflow:'hidden'
        }}>
          <TextInput style = {{
              height: 30,
              borderWidth: 0,
              flex: 1,
              paddingLeft: 0,
              paddingRight: 10
            }}
          ref="keywords"
          selectTextOnFocus = {true}
          placeholder = "输入小说书名或者作者姓名"
          onSubmitEditing = {this.submit}/>
        </View>
      </View>
    );
  }
}
