//@flow
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ListView,
  TouchableWithoutFeedback,
  PanResponder,
  RefreshControl,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import {
  Container,
  Navbar
} from 'navbar-native';
import { parseArticleContent } from '../parser';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateLastRead } from '../ducks/directory';
import parseContent from '../utils/parseContent';
//在切换页面的时候,发送通知,切换index
type Props = {
  novel: Novel,
  navigationState: any,
  directory: Array<Article>,
  index: number, // start
};

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class Reader extends React.Component {
  realm: Realm;
  props: Props;
  state: {
    index: number,//current
    refetch: number,
    navMargin: number,
    fetching: bool,
    dataSource: ListView.DataSource | null,
    fontSize: number,
    maxContentLength: number,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      index: parseInt(props.index),
      refetch: 0,
      navMargin: 0,
      fetching: true,
      dataSource: null,
      fontSize: 24,
      maxContentLength: 0,
    };
    this.realm = realmFactory();
  }

  fetchContent = (index: number, refresh: bool = false) => {
    let article: Article = this.props.directory.get(index);
    if (!article) {
      return;
    }
    this._isMounted && this.setState({
      navMargin: 0,
      fetching: true,
      maxContentLength: 0,
      index
    });

    this.realm.write(() => {
      this.props.novel.lastReadIndex = index;
      this.props.novel.lastReadTitle = article.get('title');
    });


    parseArticleContent(this.props.novel.directoryUrl, article.get('url'), refresh).then((content: string) => {
      var {height, width} = Dimensions.get('window');
      lineWidth = Math.floor((width - this.state.fontSize) * 2 / this.state.fontSize);
      let rows = parseContent(content, lineWidth);
      let nextBTN, beforeBTN;
      if (this.props.directory.get(index + 1)) {
        nextBTN = (
          <Button
            onPress={e => this.handleGotoArticle(index + 1)}
            title='下一章' />
        );
      }
      if (this.props.directory.get(index - 1)) {
        beforeBTN = (
          <Button
            onPress={e => this.handleGotoArticle(index - 1)}
            title='上一章' />
        );
      }
      let btns = (<View style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        height: 80
      }}>
        {beforeBTN}
        {nextBTN}
      </View>)
      rows.push(btns);

      let title = (
        <Text style={{
          fontSize: this.state.fontSize + 10,
          lineHeight: this.state.fontSize + 15,
          fontWeight: '300'
        }}>{article.get('title') + "\n"}</Text>
      );
      rows.unshift(title);
      rows.unshift(btns);

      this._isMounted && this.setState({
        fetching: false,
        dataSource: ds.cloneWithRows(rows),
        index
      });
    }).done(() => {
      //load more data
      for (var i = 1; i <= 5; i++) {
        if (this.props.directory.get(index + i)) {
          parseArticleContent(this.props.novel.directoryUrl, this.props.directory.getIn([index + i, 'url'])).catch(e => {
            console.log(e);
          });
        }
      }
    });


  }

  componentDidMount() {
    this.fetchContent(this.state.index);
  }

  handleGotoArticle = (index: number) => {
    this.props.updateLastRead(index);
    this.fetchContent(index);;
  }
  lastContentOffsetY = 0;
  handleScroll = (e: Event) => {
    if (e.nativeEvent.contentOffset.y > 100) {
      if (this.state.maxContentLength > 0

        &&
        (e.nativeEvent.contentOffset.y > this.state.maxContentLength
          || this.state.maxContentLength - e.nativeEvent.contentOffset.y < 200
        )
      ) {
      } else {
        let difference = e.nativeEvent.contentOffset.y - this.lastContentOffsetY;
        if (difference > 0) {
          if (this.state.navMargin > -64) {
            let val = this.state.navMargin - difference < -64 ? -64 : this.state.navMargin - difference;
            this.setState({
              navMargin: val
            });
          }
        } else {
          if (this.state.navMargin != 0) {
            let val = this.state.navMargin - difference > 0 ? 0 : this.state.navMargin - difference;
            this.setState({
              navMargin: val
            });
          }
        }
      }
    }

    this.lastContentOffsetY = e.nativeEvent.contentOffset.y;
  }
  handleEndReached = (e) => {
    this.setState({
      navMargin: 0,
      maxContentLength: this.lastContentOffsetY
    });
  }


  render() {
    let current = this.props.directory.get(this.state.index);
    if (current) {

      let content;
      if (this.state.fetching) {
        content = <View style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
        }} ><Spinner
            size={100}
            type="Pulse"
            color="gray"
            />
        </View>;
      } else {
        let style = {
          fontSize: this.state.fontSize,
          height: Math.ceil(this.state.fontSize * 1.35),
          lineHeight: Math.ceil(this.state.fontSize * 1.35),
          fontWeight: '300'
        };
        var {height, width} = Dimensions.get('window');
        //将内容分成多个数组来显示
        content = <ListView
          style={{
            height: height,
            paddingTop: 10,
            paddingLeft: this.state.fontSize - 10,
          }}
          renderFooter={() => {
            return <View style={{
              height: 100
            }} />
          } }
          onScroll={this.handleScroll.bind(this)}
          onEndReached={this.handleEndReached.bind(this)}
          initialListSize={40}
          pageSize={40}
          onEndReachedThreshold={100}
          scrollRenderAheadDistance={500}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            if (typeof (rowData) == "string") {
              return <Text style={style}>{rowData}</Text>;
            } else {
              return rowData;
            }


          } }
          />
      }

      return (
        <Container
          type="scroll"
          style={{
            backgroundColor: '#9FB2A1'
          }}>
          <Navbar
            title={current.get('title')}
            left={{
              icon: "ios-arrow-back",
              label: "返回",
              onPress: Actions.pop
            }}
            right={{
              label: "刷新",
              onPress: e => {
                this.fetchContent(this.state.index, true);
              }
            }}
            style={{
              marginTop: this.state.navMargin
            }}
            />
          {content}
        </Container>
      );
    } else {
      return (
        <Container>
          <Navbar
            title="没有下一章了"
            left={{
              icon: "ios-arrow-back",
              label: "返回",
              onPress: Actions.pop
            }}
            />
          <Text>没有更多内容了</Text>
        </Container>
      );
    }
  }

  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLastRead: bindActionCreators(updateLastRead, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader);