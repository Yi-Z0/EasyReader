//@flow
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
TouchableWithoutFeedback
  } from 'react-native';

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
  }
});

class Row extends Component {
    props:{
        onPress:func,
        novel:Novel
    };

    shouldComponentUpdate(nextProps, nextState) {
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
    this.lastRenderParams.lastReadIndex = this.props.novel.lastReadIndex
    this.lastRenderParams.lastArticleTitle = this.props.novel.lastArticleTitle

    let novel = this.props.novel;
    
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

    return (
      <TouchableWithoutFeedback
      onPress={this.props.onPress}
      >
        <View style={styles.rowItem}
        >
          <Text style={styles.rowTitle}>{novel.title}</Text>
          {lastArticleText}
          {lastReadText}
          <Text 
          style={styles.rowSubTitle}
          numberOfLines={1}>来源 : {novel.directoryUrl}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Row;