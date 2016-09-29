//@flow
import React from 'react';
import {View,Text} from 'react-native';
import { ListView } from 'realm/react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';

import rules from '../../rules';
import {parseDirectory} from '../../models/Novel';

type Props = {
  novel:Novel,
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.url != r2.url});

export default class Directory extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    fetching: boolean,
    error:string,
  };

  constructor(props:Props) {
    super(props);
    this.state = {
      fetching:false,
      error:'',
    };
    this.realm = realmFactory();
  }
  
  componentWillMount() {
    if (!this.props.novel.isParseDirectory) {
      this.setState({
        fetching:true
      });
      // let articles = this.props.novel.parseDirectory();
      // console.log(2,articles);
    }
    
    parseDirectory(this.props.novel).then((articles)=>{
      this.realm.write(()=>{
        for(var article of articles){
          if(!this.props.novel.isParseDirectory || this.realm.objects('Article').filtered(`url="${article.url}"`).length == 0){
            this.props.novel.directory.push(article);
          }
        }
        this.props.novel.isParseDirectory = true;
        this.setState({
          fetching:false
        });
      });
    })
      
  }
  
  render() {
    // this.props.novel;
    let content;
    if (this.state.fetching) {
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
      // content = <List ds={ds.cloneWithRows(this.state.novels)}/>;
    }
    
    return (
      <View style={{
        flex: 1,
        marginTop:64
      }}>
      {content}
      </View>
    );
  }

}
