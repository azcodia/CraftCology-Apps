import React, { Component } from 'react';
import { 
  View, 
  Text,
  PickerIOS
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Actions } from 'react-native-router-flux';

let ADD_NEW_ADDRESS = 0;

export default class AddressDropdown extends React.Component {

  onSelect = (itemIndex, itemValue) => {
    this.setState({
      selectedValue: itemValue
    });
    if (this.props.onSelect) {
      this.props.onSelect(itemValue);
    }
    if (itemValue == ADD_NEW_ADDRESS) {
      Actions.shippingAddressForm({
        user: this.state.user, 
        title: 'Create New Address', 
        item: null,
        isFromOrderForm: true
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue,
      user: this.props.user,
      data: []
    };

    console.log(this.props.user);
  }

  render() {
   let data = [{
     value: ADD_NEW_ADDRESS,
     label: 'Add New Address'
   }];
   if (this.props.data.length > 0) {
     this.props.data.map(prov => {
       data.push({
         value: prov.id,
         label: prov.address_name
       })
     });
   }
    return (
      <View>
        <Dropdown
          label={this.props.label}
          data={data}
          value={this.state.selectedValue}
          onChangeText={(itemValue, itemIndex) => this.onSelect(itemIndex, itemValue)}
        />
      </View>
    );
  }
}