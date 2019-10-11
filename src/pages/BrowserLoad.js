import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  WebView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import HTML from 'react-native-render-html';
import { Global } from '../helpers/Global';

export default class BrowserLoad extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return(
      // <View style={styles.container}>
      //   <HTML
      //     html={this.props.item.description}
      //   />
      // </View>
      <WebView
        source={{uri: Global.getBaseUrl() + this.props.url}}
        startInLoadingState={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0
  }
});