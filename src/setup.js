//@flow
import React from 'react';
import { Scene,Router } from 'react-native-router-flux';
require('./db');

import {Bookshelf,Search,Directory,Reader} from './containers';

class App extends React.Component {
  render() {
    return (
       <Router>
          <Scene hideNavBar key="root">
            <Scene key="bookshelf" component={Bookshelf} title="我的书架"/>
            <Scene key="search" component={Search} title="搜索"/>
            <Scene key="directory" component={Directory} title="目录"/>
            <Scene key="reader" component={Reader} title="阅读器"/>

          </Scene>
      </Router>
    );
  }
}

module.exports = ()=>{
  return App;
}