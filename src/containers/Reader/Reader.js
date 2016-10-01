//@flow
import React from 'react';
import {View,Text,ScrollView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';

import Article from './Components/Article';
type Props = {
  directory:array<Article>,
  navigationState:any,
  directoryUrl:string,
  index:number, // start
};

export default class Reader extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    index:number,//current
    refetch:number
  };
  
  directory:array<Article>;
  constructor(props:Props) {
    super(props);
    this.state = {
      index:parseInt(props.index),
      refetch:0
    };
    this.realm = realmFactory();
  }
  
  render() {
    let current:Article = this.props.directory[this.state.index];
    if (current) {
      
      return (
        <Container>
        <Navbar
        title={current.title}
        left={{
          icon: "ios-arrow-back",
          label: "返回",
          onPress: Actions.pop
        }}
        right={{
          label: "刷新",
          onPress: e=>this.setState({
            refetch:this.state.refetch+1
          })
        }}
        />
        <ScrollView backgroundColor='#9FB2A1'>
        <Article refetch={this.state.refetch} directoryUrl={this.props.directoryUrl} url={current.url} />
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop:20,
        }}>
        <Text style={{
          color: '#567BE4'
        }} onPress={e=>this.setState({
          index:this.state.index-1
        })}>上一章</Text>
        <Text style={{
          color: '#567BE4'
        }} onPress={e=>this.setState({
          index:this.state.index+1
        })}>下一章</Text>
        </View>
        </ScrollView>
        </Container>
      );
    }else{
      return (
        <Container>
        <Navbar
        title="没有下一章了"
        left={{
          icon: "ios-arrow-back",
          label: "返回",
          onPress: Actions.pop
        }}
        />
        <Text>没有更多内容了</Text>
        </Container>
      );
    }
  }
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }

}
