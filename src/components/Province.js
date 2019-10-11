import React, { Component } from 'react';
import { 
  View, 
  Text,
  PickerIOS
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

export default class Province extends React.Component {
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
   this.props.data.map(prov => {
     data.push({
       value: prov.id,
       label: prov.name
     })
   });
    return (
      <View>
        <Dropdown
          label='Province'
          data={data}
          value={this.state.selectedValue}
          onChangeText={(itemValue, itemIndex) => this.onSelect(itemIndex, itemValue)}
        />
      </View>
    );
  }
}