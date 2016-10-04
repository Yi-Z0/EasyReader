//@flow
import React from 'react';
import {View,ListView} from 'react-native';
import { Container, Navbar } from 'navbar-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import dismissKeyboard from 'dismissKeyboard';
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import {search} from '../../ducks/search';
import List from './components/List';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});

class Search extends React.Component {
  
  keywords = '';
  handleChangeKeyword = (s:string)=>this.keywords=s;
  
  handleSearch = ()=>{
    dismissKeyboard();
    this.props.search(this.keywords);
  }
  
  _textInputRef;
  render() {
    let content;
    if (this.props.searching) {
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
      content = <List ds={ds.cloneWithRows(this.props.novels)}/>;
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
            placeholder='输入书名,作者,主角等进行搜索' />
            
            {content}
        </Container>
    );
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    ...state.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    search: bindActionCreators(search, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);