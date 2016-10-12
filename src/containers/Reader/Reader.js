//@flow
import React from 'react';
import {
  View,
  Text,
  Dimensions,
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
import { Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { parseArticleContent } from '../../parser';
import { updateLastRead } from '../../ducks/directory';
import stringWidth from '../../utils/stringWidth';

//在切换页面的时候,发送通知,切换index
type Props = {
  novel: Novel,
  directory: Array<Article>,
  index: number, // start
};

class Reader extends React.Component {
  realm: Realm;
  props: Props;
  state: {
    index: number,//current
    refetch: number,
    fetching: bool,
    fontSize: number,
    lines:Array<string>,
    page:number,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      index: parseInt(props.index),
      refetch: 0,
      fetching: true,
      fontSize: 24,
      lines:[],
      page:1,
    };
    this.realm = realmFactory();
  }

  fetchContent = (index: number, refresh: bool = false) => {
    let article: Article = this.props.directory.get(index);
    if (!article) {
      return;
    }
    this._isMounted && this.setState({
      fetching: true,
      index
    });

    this.realm.write(() => {
      this.props.novel.lastReadIndex = index;
      this.props.novel.lastReadTitle = article.get('title');
    });


    parseArticleContent(this.props.novel.directoryUrl, article.get('url'), refresh).then((content: string) => {
      var {height, width} = Dimensions.get('window');
      lineWidth = Math.floor((width - 40) * 2 / this.state.fontSize);
      let lines = parseLine(content, lineWidth);
      this._isMounted && this.setState({
        fetching: false,
        page:1,
        lines,
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
  
  get numbersOfLinesPerPages(){
    let {height, width} = Dimensions.get('window');
    let margin = 20;
    height -= margin*2;
    let lineHeight = this.state.fontSize + 15;
    return Math.floor(height/lineHeight);
  }

  get contentOfCurrentPage(){
    let numbersOfLinesPerPages = this.numbersOfLinesPerPages;
    console.log(numbersOfLinesPerPages,this.state.page);
    let linesStart = (this.state.page-1)*numbersOfLinesPerPages;
    console.log(linesStart);
    return this.state.lines.slice(linesStart,numbersOfLinesPerPages).join("\n");
  }

  render() {
    let current = this.props.directory.get(this.state.index);
    if (current) {

      let content,loading = false;
      if(this.state.fetching){
        loading={
          styleContainer:{
            marginTop:64
          }
        }
      }else{
        let style = {
          fontSize: this.state.fontSize,
          lineHeight: Math.ceil(this.state.fontSize * 1.35),
          fontWeight: '300',
          padding:20,
        };
        
        content = <View><Text style={style}>{this.contentOfCurrentPage}</Text></View>
      }
      return (
        <View
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
            />
          {content}
        </View>
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


function parseLine(str, width, cleanEmptyLine = true) {
  if (!str || str == '') {
    return [];
  }
  str.replace("\t", '  ');
  let lines = [];
  let currentLine = '';
  let currentLineWidth = 0;
  for (let i in str) {
    try {
      let s = str[i];
      let code = s.charCodeAt();

      if (code == 10 || code == 13) {
        if (currentLine.trim() == '' && lines.length > 1 && lines[lines.length - 1].trim() == '') {
          //过滤空行
        } else {
          lines.push(currentLine);
        }
        currentLine = '';
        currentLineWidth = 0;
        continue;
      }

      var sWidth = stringWidth(s);
      if (currentLineWidth + sWidth > width) {
        lines.push(currentLine);
        currentLine = '';
        currentLineWidth = 0;
      }

      currentLine += s;
      currentLineWidth += sWidth;
    } catch (error) {
      console.log(error);
    }
  }

  return lines;
}