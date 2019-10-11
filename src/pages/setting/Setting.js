import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { 
  Button,
  Text,
  Avatar,
  ListItem
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Global, Session } from '../../helpers/Global';

export default class Setting extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      session: new Session(),
      signOutButtonIsLoading: false
    };
    Actions.refresh({title: 'Setting'});
  }

  _onPressSignOut() {
    this.setState({
      signOutButtonIsLoading: true,
    });
    this.state.session.logout().then((value) => {
      setTimeout(() => {
        this.setState({
          isLoggedIn: null,
          signOutButtonIsLoading: false
        });
        Global.presentToast(value ? value : "Logout success");
        Actions.reset('maintab');
      }, 1000);
    });
    
  }
  
  render() {
    return(
      <ScrollView style={styles.scrollView}>
        <View>
          <Avatar
            rounded
            width={100}
            containerStyle={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, marginBottom: 20 }}
            source={require('./../../images/user.png')}
            onPress={() => console.log('ad')}
          />
          <Text style={{ marginBottom: 5 }}>Account</Text>
          <View style={{backgroundColor: '#fff'}}>
            <ListItem
              key={1}
              title={"Profile"}
              leftIcon={{ name: 'account-circle', type: 'material-community' }}
              onPress={() => Actions.profile()}
            />
            <ListItem
              key={2}
              title={"Change Password"}
              leftIcon={{ name: 'security-account', type: 'material-community' }}
              onPress={() => Actions.password()}

            />
          </View>

          <Text style={{ marginBottom: 5, marginTop: 10 }}>About Us</Text>
          <View style={{backgroundColor: '#fff'}}>
            <ListItem
              key={1}
              title={"Term and Condition"}
              leftIcon={{ name: 'list', type: 'entypo' }}
              onPress={() => Actions.browserLoad({headerTitle: 'Term and Condition', url: 'terms-and-conditions-mobile'})}
            />
            <ListItem
              key={2}
              title={"Privacy Policy"}
              leftIcon={{ name: 'list', type: 'entypo' }}
              onPress={() => Actions.browserLoad({headerTitle: 'Privacy Policy', url: 'privacy-police-mobile'})}
            />
            <ListItem
              key={3}
              title={"Help"}
              leftIcon={{ name: 'help-circle', type: 'feather' }}
            />
          </View>
          <Button 
            loading={this.state.signOutButtonIsLoading} 
            title={this.state.signOutButtonIsLoading ? ' ' : 'Logout'} 
            onPress={() => this._onPressSignOut()} 
            backgroundColor='#c91a43' 
            color='#fff' 
            containerViewStyle={{
              marginTop: 10,
              borderRadius: 5,
              width: '100%',
              marginLeft: 0
            }}
            buttonStyle={{
              borderRadius: 5
            }}
           />
           <Text style={{ marginBottom: 5, marginTop: 10, fontSize: 12 }}>Version 1.0</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10
  }
});
