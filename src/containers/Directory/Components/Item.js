import React from 'react';
import { ListItem } from 'react-native-elements';
import {StyleSheet} from 'react-native';
let styles = StyleSheet.create({
  selected:{
    color:"#FD973C"
  },
  unselected:{
    
  }
})
class Item extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item === this.props.item) {
      return false;
    }
    
    return true;
  }
  render() {
    console.log('render ',this.props.item.get('title'));
    let style;
    if(this.props.item.get('lastRead')){
      style = styles.selected;
    }else{
      style = styles.unselected;
    }
    return <ListItem
        titleStyle={style}
        key={this.props.item.get('url')}
        title={this.props.item.get('title')}
        onPress={this.props.onPress}
      />;
  }

}

export default Item;