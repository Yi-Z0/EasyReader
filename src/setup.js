//@flow
import React from 'react';
import { Scene,Router } from 'react-native-router-flux';
require('./db');

import {Bookshelf,Search} from './containers';

class App extends React.Component {
  render() {
    
    return (
       <Router>
          <Scene key="root">
            <Scene key="bookshelf" component={Bookshelf} title="我的书架" renderRightButton={Bookshelf.renderSearchBTN}/>
            <Scene key="search" component={Search} title="搜索"/>
            {/*
            <Scene key="profile" component={Profile} />
            <Scene key="reader" component={Reader} />
            */}

          </Scene>
      </Router>
    );
  }
}

module.exports = ()=>{
  return App;
}