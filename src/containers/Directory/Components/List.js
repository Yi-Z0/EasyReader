//@flow
import React from 'react';
import {View,Text,ListView} from 'react-native';
import Item from './Item';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
        initialListSize={200}
        pageSize={200}
        onEndReachedThreshold={0}
        scrollRenderAheadDistance={1000}
        ref={this.props.scrollRef}
        dataSource={ds.cloneWithRows(this.props.items.toArray())}
        renderRow={(rowData,_,rowID)=><Item onPress={this.props.handleClickArticle.bind(null,rowData,rowID)} item={rowData}/>}
      />
    );
  }

}

export default List;