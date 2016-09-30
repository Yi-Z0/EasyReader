//@flow
import React from 'react';
import {View,Text,ScrollView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import { Container, Navbar } from 'navbar-native';

type Props = {
  directory:array<Article>,
  navigationState:any,
  index:number, // start
};

export default class Reader extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    index:string,//current
  };
  
  directory:array<Article>;
  constructor(props:Props) {
    super(props);
    this.state = {
      index:props.index
    };
    this.realm = realmFactory();
  }
  
  render() {
    return (
      <Container>
          <Navbar
              title="当前章节标题"
              left={{
                  icon: "ios-arrow-back",
                  label: "返回",
                  onPress: Actions.pop
              }}
          />
          <Text>{this.props.directory[this.state.index].title}</Text>
      </Container>
    );
  }
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }

}
