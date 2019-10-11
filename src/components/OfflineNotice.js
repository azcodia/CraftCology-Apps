import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Text
} from 'react-native';

export default class OfflineNotice extends Component {
  
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
    // width: '100%',
    //position: 'absolute',
    //top: 30
  },
  offlineText: { 
    color: '#fff'
  }
});