import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

export default class TabIcon extends React.Component {

  componentDidMount() {
    //SplashScreen.hide();
  }

  render() {
    let color = this.props.focused ? '#333' : '#888';
    if (this.props.iconName == 'maximize') {
      color = '#000';
      return (
        <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center', paddingTop: 5, padddingBottom: 5}}>
        <Icon style={{color: color}} color={color} name={this.props.iconName || "circle"} size={26} type={this.props.iconType || "feather"} />
          <Text style={{color: color, fontSize: 11, fontWeight: 'bold'}}>{this.props.iconTitle}</Text>
        </View>
      );
    }
    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center', paddingTop: 5, padddingBottom: 5}}>
        <Icon style={{color: color}} color={color} name={this.props.iconName || "circle"} size={25} type={this.props.iconType || "feather"} />
        <Text style={{color: color, fontSize: 11}}>{this.props.iconTitle}</Text>
      </View>
    );
  }
}