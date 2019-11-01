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
import { connect } from 'react-redux';

class MaterialsPages extends Component{
    render() {
        return(
            <View>
                <Text>PAGE MATERIALS</Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
      user: state.user.user,
      isLoggedIn: state.user.isLoggedIn,
      carts: state.carts.cart
    };
  };
  
const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaterialsPages)