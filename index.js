/** @format */

import React, { Component } from 'react';
import { 
  AppRegistry,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import { Provider } from 'react-redux';
import App from './src/App';
import {name as appName} from './app.json';
import { configureStore, persistor } from './src/stores/configureStore';
import { PersistGate } from 'redux-persist/integration/react';

export default class BaseApp extends Component {

  renderLoading() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  render() {
    return (
      <Provider store={configureStore}>
        <PersistGate persistor={persistor} loading={this.renderLoading()}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => BaseApp);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});