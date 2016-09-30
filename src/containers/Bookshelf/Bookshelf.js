//@flow
import React from 'react';
import {View,TouchableWithoutFeedback} from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import { Container, Navbar } from 'navbar-native';

import { ListView } from 'realm/react-native';

type Props = {
  
};
let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.directoryUrl != r2.directoryUrl});
export default class Bookshelf extends React.Component {
  realm:Realm;
  props: Props;
  state: {
    dataSource:ListView.DataSource,
  };
  
  constructor(props:Props){
    super(props);
    this.realm = realmFactory();
    this.state = {
      dataSource: ds.cloneWithRows(this.realm.objects('Novel')),
    };
    this.realm.addListener('change', () => {
      this.setState({
        dataSource:ds.cloneWithRows(this.realm.objects('Novel')),
      })
    });
  }
  
  componentWillUnmount(){
    this.realm.removeAllListeners();
  }

  render() {
    return (
      <Container>
          <Navbar
              title="易读小说"
              right={{
                  icon: 'ios-search',
                  iconSize: 20,
                  onPress: Actions.search
              }}
          />
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData,sectionID,rowID) => {
              return <ListItem
                  onPress={e=>{
                    Actions.directory({novel:rowData})
                  }}
                  key={sectionID}
                  title={rowData.title}
                />;
            }}
          />
      </Container>
    );
  }

}
