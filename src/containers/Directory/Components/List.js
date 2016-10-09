//@flow
import React from 'react';
import ImmutableDataSource from 'react-native-immutable-listview-datasource';
import {View,Text,ListView} from 'react-native';
import Item from './Item';
let ds = new ImmutableDataSource();

type Props={
  items:Array<any>,
  scrollRef:func,
  handleClickArticle:func,
  id:string,
};
class List extends React.Component {
  props: Props;
  
  render() {
    return (
      <ListView
        enableEmptySections={true}
        initialListSize={20}
        pageSize={1}
        onEndReachedThreshold={0}
        scrollRenderAheadDistance={100}
        ref={this.props.scrollRef}
        dataSource={(new ImmutableDataSource()).cloneWithRows(this.props.items)}
        renderRow={(rowData,_,rowID)=><Item onPress={this.props.handleClickArticle.bind(null,rowData,rowID)} item={rowData}/>}
      />
    );
  }

}

export default List;