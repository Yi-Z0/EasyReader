//@flow
import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    Easing,
    StyleSheet,
    ScrollView} from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';


let styles = StyleSheet.create({
  rowItem: {
    padding:10,
    backgroundColor:'#ffffff',
    height:100,
  },
  rowTitle: {
    fontSize:24,
  },
  rowSubTitle:{
    color:'#666666'
  },
  swipeView:{
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    height:100,
  },
  deleteBtn:{
    color:"#ffffff",
    padding:10,
    lineHeight:100,
    backgroundColor:'red',
    marginRight:-20
  }
});

let styleSwipeRow = {
    borderBottomWidth: 1,
    borderColor:'#cccccc'
};

class Row extends Component {
    props:{
        onDelete:func,
        onPress:func,
        novel:Novel
    };
    constructor(props) {
      super(props);
    
      this.state = {
        fadeInOpacity: new Animated.Value(1),
        hide:false
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (nextState.hide != this.state.hide) {
        return true;
      }
      if (
        nextProps.novel.directoryUrl == this.props.novel.directoryUrl
        &&
        nextProps.novel.lastReadIndex == this.lastRenderParams.lastReadIndex
        &&
        nextProps.novel.lastArticleTitle == this.lastRenderParams.lastArticleTitle

        ) {
        return false;

      }

      return true;
    }


  lastRenderParams = {};
  render() {
    if (this.state.hide) {
        return <View/>
    }

    this.lastRenderParams.lastReadIndex = this.props.novel.lastReadIndex
    this.lastRenderParams.lastArticleTitle = this.props.novel.lastArticleTitle

    let novel = this.props.novel;
    if (!novel.isValid()) {
        return <View/>;
    }
    let lastReadText , lastArticleText;
    if(novel.lastReadTitle){
    lastReadText = (<Text
        style={styles.rowSubTitle}
        numberOfLines={1}
        >已读 : {novel.lastReadTitle}
        </Text>
    );
    }
    if(novel.lastArticleTitle){
    lastArticleText = (<Text
        style={styles.rowSubTitle}
        numberOfLines={1}
        >最新 : {novel.lastArticleTitle}</Text>)
    }

    let style = {
        opacity:this.state.fadeInOpacity
    };
    
    return (
        <Animated.View style={style}>
      <SwipeRow
        style={styleSwipeRow}
        disableRightSwipe
        rightOpenValue={-65}
        onRowPress={this.props.onPress}
      >
        <View style={styles.swipeView}>
          <Text></Text>
          <Text onPress={e=>{
            Animated.timing(this.state.fadeInOpacity, {
                toValue: 0, // 目标值
                duration: 500, // 动画时间
                easing: Easing.linear // 缓动函数
            }).start(() => {
                this.setState({
                    hide:true
                });
                this.props.onDelete();
            });

        }} style={styles.deleteBtn}>删除</Text>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.rowTitle}>{novel.title}</Text>
          {lastArticleText}
          {lastReadText}
          <Text 
          style={styles.rowSubTitle}
          numberOfLines={1}>来源 : {novel.directoryUrl}</Text>
        </View>
      </SwipeRow>
      </Animated.View>
    );
  }
}

export default Row;