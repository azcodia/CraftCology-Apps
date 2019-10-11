import React, { Component } from 'react';
import { 
  View, 
  Text,
  PickerIOS
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Global } from '../helpers/Global';
import { getPublic } from '../providers/Api';

export default class   extends React.Component {
  onSelect = (itemIndex, itemValue) => {
    this.setState({
      selectedValue: itemValue
    });
    if (this.props.onSelect) {
      this.props.onSelect(itemValue);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue,
      data: []
    };
    this.getData();
  }

  getData() {
    var uri = 'payment-account';
    return getPublic(uri).then(response => {
      this.setState({
        data: response.data.data
      })

    })
    return fetch(Global.getBaseUrl() + 'api/v1/payment-account', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        data: responseJson.data
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
   let data = [];
   this.state.data.map(prov => {
     data.push({
       value: prov.id,
       label: prov.type + ' - ' + prov.account_name + ' - ' + prov.account_number
     })
   });
    return (
      <View>
        <Dropdown
          label={this.props.label ? this.props.label : "Payment To"}
          data={data}
          value={this.state.selectedValue}
          onChangeText={(itemValue, itemIndex) => this.onSelect(itemIndex, itemValue)}
        />
      </View>
    );
  }
}