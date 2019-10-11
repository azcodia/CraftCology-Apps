import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Home from './Home';
import Customize from './Customize';
import Account from './Account';

export default class MainTab extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'home', title: 'Home' },
      { key: 'customize', title: 'Customize' },
      { key: 'account', title: 'Account' },
    ],
  };

  _renderTabBar = props => (
    <View>
      <TouchableOpacity activeOpacity={0.5} style={styles.touchableOpacityStyle} >
        <Text style={{ color: '#fff' }}>ASK</Text>
      </TouchableOpacity>
      <TabBar style={{backgroundColor:'#fff'}} labelStyle={{ color: '#888' }} indicatorStyle={{ backgroundColor: '#fff' }} {...props} />
    </View>
  )

  render() {
    return(
      <TabView
        navigationState={this.state}
        renderTabBar={this._renderTabBar}
        swipeEnabled={false}
        renderScene={SceneMap({
          home: Home,
          customize: Customize,
          account: Account
        })}
        tabBarPosition="bottom"
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 80,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  loginButton: {
    marginTop: 10
  },
  registerButton: {
    marginLeft: 16,
    marginTop: 10
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    bottom: 65,
    backgroundColor: '#c91a43',
    borderRadius: 50
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  }
});
