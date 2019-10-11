import React, { Component } from 'react';
import { 
  View, 
  Text,
  Picker
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
export default class City extends React.Component {
  onSelect = (itemIndex, itemValue) => {
    this.setState({
      selectedValue: itemValue
    });
    this.props.onSelect(itemValue);
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue
    };
  }
  render() {
  let data = [];
   this.props.data.map(city => {
     data.push({
       value: city.id,
       label: city.name
     })
   });
    return (
      <View>
        <Dropdown
          label='City'
          data={data}
          value={this.state.selectedValue}
          onChangeText={(itemValue, itemIndex) => this.onSelect(itemIndex, itemValue)}
        />
      </View>
    );
  }
}
