//@flow
import React from 'react';
import {View,ListView} from 'react-native';
import { Container, Navbar } from 'navbar-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import dismissKeyboard from 'dismissKeyboard';

import {Master} from '../../parser';

import { SearchBar } from 'react-native-elements'
import List from './components/List';

type Props = {
  
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});

export default class Search extends React.Component {
  props: Props;
  state: {
    searching: boolean,
    error: string,
    novels:Novel[],
    keywords:string,
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      searching:false,
      error:'',
      novels:[],
      keywords:'',
    };
  }
  
  keywords = '';
  handleChangeKeyword = (s:string)=>this.keywords=s;
  
  handleSearch = ()=>{
    dismissKeyboard();
    let keywords = this.keywords;
    this.setState({
      searching:true,
      novels:[],
      error:'',
      keywords
    });
    
    let master = new Master();
    
    master.search(keywords,(novel)=>{
      //TODO check this is mount before setState
      if (keywords == this.state.keywords) {
        this._isMounted && this.setState({
          searching:false,
          novels:[...this.state.novels,novel]
        });
      }
    }).then((data)=>{
      console.log('finished');
    }).catch((error)=>{
      this._isMounted && this.setState({
        searching:false,
        error
      });
    });
  }
  
  _isMounted = true;
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
    let content;
    if (this.state.searching) {
      content =  <View style={{
        flex:1,
        alignSelf:'center',
        justifyContent:'center',
      }} ><Spinner
      style={{
        marginTop:-300
      }}
      size={100}
      type="Pulse"
      color="gray"
      />
      </View>;
    }else{
      content = <List ds={ds.cloneWithRows(this.state.novels)}/>;
    }
    
    return (
        <Container>
            <Navbar
                title="搜索"
                left={{
                    icon: "ios-arrow-back",
                    label: "返回",
                    onPress: Actions.pop
                }}
            />
            <SearchBar
            lightTheme
            round
            onSubmitEditing={this.handleSearch.bind(this)}
            onChangeText={this.handleChangeKeyword.bind(this)}
            textInputRef="keywords"
            placeholder='输入书名,作者,主角等进行搜索' />
            
            {content}
        </Container>
    );
  }

}
