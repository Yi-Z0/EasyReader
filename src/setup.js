//@flow
import React from 'react';
import { Scene,Router,DefaultRenderer } from 'react-native-router-flux';
import {View} from 'react-native';

import {Provider,connect} from 'react-redux';
require('./db');

import {Bookshelf,Search,Directory,Reader} from './containers';


let realm = realmFactory();
realm.write(()=>{
  realm.delete(realm.objects('Novel').filtered(`active=false`)); // Deletes all articles
});


import store from './store';
const RouterWithRedux = connect()(Router);

var MessageBarAlert = require('react-native-message-bar').MessageBar;

class MainScene extends React.Component{
  render(){
    const state = this.props.navigationState;
    const children = state.children;
    return (<View>
      <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      <MessageBarAlert ref="alert" />
    </View>)
  }
}

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene hideNavBar key="root">
            <Scene key="bookshelf" component={Bookshelf} title="我的书架"/>
            <Scene key="search" component={Search} title="搜索"/>
            <Scene key="directory" component={Directory} title="目录"/>
            <Scene key="reader" component={Reader} title="阅读器"/>

          </Scene>
          </RouterWithRedux>
        </Provider>
    );
  }
}

module.exports = ()=>{
  return App;
}