import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  Text
} from 'react-native';

export default class CartEmpty extends Component {
  
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.cartImageEmpty}
          source={require('./../images/cart_empty.png')}
          resizeMode="center"
        />
        <Text style={styles.title}>
          Oops your bag is still empty
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
    alignItems: 'center', 
    marginTop: -60
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