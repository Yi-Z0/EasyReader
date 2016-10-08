//@flow
import React from 'react';
import {
    ListView,
    Text,
    View,
    Alert
} from 'react-native';

import Item from './Item';

export default class List extends React.Component {
  props:{
    ds:ListView.DataSource
  };
  render() {
      return (<ListView
        dataSource={this.props.ds}
        renderRow={(novel) => <Item novel={novel}/>}
        enableEmptySections={true}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={false}
      />);
  }
}
