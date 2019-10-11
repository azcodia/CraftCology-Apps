import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  Text
} from 'react-native';

export default class DataNotFound extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      title: this.props.title
    }

    if (!this.props.title) {
      this.state.title = 'Oops data not found';
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Image
          style={styles.cartImageEmpty}
          source={require('./../images/404.png')}
          resizeMode="center"
        />
        <Text style={styles.title}>
          {this.state.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff', 
    flex : 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  cartImageEmpty: {
    width: 150, 
    height: 150
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  }
});