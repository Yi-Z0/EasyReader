//@flow
'use strict';
import React from 'react';
import type {Novel} from 'novel-parser';
import {TouchableHighlight,Text,View} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Item extends React.Component {
  props:{
    novel:Novel
  };
  
  handleClick = (e:Event)=>{
    //save novel to realm and redirect when save success
    Actions.directory({novel:this.props.novel})
  };
  
  render() {
    return (
      <TouchableHighlight onPress={this.handleClick} underlayColor="#cccccc" style={{
        paddingVertical: 5
      }}>
                <View style={{
                    flexDirection:'row',
                    paddingTop:10,
                    paddingBottom:20,
                    paddingHorizontal:10,
                    borderBottomWidth:1,
                    borderColor: '#eeeeee'
                }}>
                    <View style={{
                        flex:1,
                        flexDirection:'column',
                        padding:5
                    }}>
                        <Text style={{
                            marginVertical:3,
                            fontSize:18
                        }} numberOfLines={1}>{this.props.novel.title}</Text>
                        <Text style={{
                            color:'#666666',
                            marginTop:10,
                            textAlign:'justify'
                        }} numberOfLines={3}>{this.props.novel.desc}</Text>
                        <Text style={{
                            marginTop:10,
                            color:'#666666',
                            borderColor:'#666666',
                            lineHeight:18
                        }} numberOfLines={1}>来源 : {this.props.novel.directoryUrl}</Text>
                    </View>

                </View>
            </TouchableHighlight>
    );
  }

}
