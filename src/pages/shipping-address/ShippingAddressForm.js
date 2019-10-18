import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Picker,
  ScrollView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button
} from 'react-native-elements';
import { Global, Session } from '../../helpers/Global';
import Province from '../../components/Province';
import City from '../../components/City';
import { Actions } from 'react-native-router-flux';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { 
  setListUserAddress, unsetUser 
} from '../../stores/actions/index';
import { requestPublic } from '../../providers/Api';

class ShippingAddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: new Session(),
      buttonIsLoading: false,
      formUrl: 'customer-address',
      formMethod: 'POST',
      provinces: [],
      cities: [],
      name: '',
      address: '',
      address2: '',
      relationship: '',
      provinceId: '',
      cityId: '',
      postalcode: '',
      phone: '',
      listForms: [
        'name',
        'address',
        'address2',
        'postalcode',
        'phone'
      ]
    };

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.onSubmitAddress = this.onSubmitAddress.bind(this);
    this.onSubmitAddress2 = this.onSubmitAddress2.bind(this);
    this.onSubmitPostalcode = this.onSubmitPostalcode.bind(this);

    this.nameRef = this.updateRef.bind(this, 'name');
    this.addressRef = this.updateRef.bind(this, 'address');
    this.address2Ref = this.updateRef.bind(this, 'address2');
    this.postalcodeRef = this.updateRef.bind(this, 'postalcode');
    this.phoneRef = this.updateRef.bind(this, 'phone');

    if (this.props.item != null) {
      this.state.formUrl = 'customer-address/' + this.props.item.id;
      this.state.formMethod = 'PATCH';
      this.state.name = this.props.item.address_name;
      this.state.address = this.props.item.address;
      this.state.address2 = this.props.item.address2 != null ? this.props.item.address2 : '';
      console.log(this.props.item);
      this.state.provinceId = this.props.item.province.id;
      this.state.cityId = this.props.item.city.id;
      this.state.relationship = this.props.item.addressrelationship_id;
      this.state.postalcode = this.props.item.postal_code;
      this.state.phone = this.props.item.phone;
    }
    console.log(this.props.item);
  }

  componentWillMount() {
    this.getProvinces();
    this.relationships = [
      {value: "1", label: "Customer"},
      {value: "2", label: "Myself"},
      {value: "7", label: "Others"}
    ];
  }

  getProvinces() {
    return fetch(Global.getBaseUrl() + 'api/v1/province', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        provinces: responseJson.data,
      });
      if (this.props.item != null) {
        this.onSelectProvince(this.state.provinceId);
      }
      console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onSelectProvince = (provId) => {
    console.log(provId);
    const selCities = this.state.provinces.filter(c => c.id === provId);
    this.setState({
      provinceId: provId,
      cities: selCities.length > 0 ? selCities[0].cities : []
    });
  }

  onSelectCity = (city) => {
    console.log(city);
    this.setState({
      cityId: city
    });
  }

  onSubmit() {
    let errors = {};

     console.log(this.state.provinceId);
     console.log(this.state.cityId);
     console.log(this.state.relationship);

    this.state.listForms
      .forEach((name) => {
        let value = this[name].value();
        if (!value) {
          errors[name] = 'Should not be empty';
        }
        if (name === 'address2') {
          delete errors[name];
        }
      });

    if(this.state.phone.length < 10 || this.state.phone.length > 13) {
      errors['phone'] = 'Number not required';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    if (!this.state.provinceId) {
      showMessage({
        message: 'Province is required',
        type: 'warning'
      });
      return;
    }

    if (!this.state.cityId) {
      showMessage({
        message: 'City is required',
        type: 'warning'
      });
      return;
    }

    this.setState({
      buttonIsLoading: true,
    }, function(){
      let params = {
        address_name: this.state.name,
        addressrelationship_id: this.state.relationship,
        address: this.state.address,
        address2: this.state.address2,
        country_id: "indonesia",
        province_id: this.state.provinceId,
        city_id: this.state.cityId,
        postal_code: this.state.postalcode,
        phone: this.state.phone
      };
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.token
      };
      requestPublic(this.state.formMethod, this.state.formUrl, params, headers).then(response => {
        this.setState({
          buttonIsLoading: false,
        });
        if (response.status == 200 || response.status == 201) {
          showMessage({
            message: response.data.message,
            type: "success"
          });
          this.props.onSetListUserAddress(response.data.data);
          Actions.pop({ refresh: { models: response.data.data, isFromOrderForm: this.props.isFromOrderForm } });
          return;
        }
        showMessage({
          message: response.data.message,
          type: "danger"
        });
      }).catch(error => {
        this.props.onUnsetUser();
        this.setState({
          buttonIsLoading: false,
        });
        Actions.login();
      });
    })
  }

  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }

  onChangeText(text) {
    this.state.listForms
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitName() {
    this.name.focus();
  }

  onSubmitPostalcode() {
    this.postalcode.focus();
  }

  onSubmitPhone() {
    this.phone.focus();
  }

  onSubmitAddress() {
    this.address.focus();
  }

  onSubmitAddress2() {
    this.address2.focus();
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    let { errors = {}, ...data } = this.state;

    return (
      <KeyboardAwareScrollView>
        <ScrollView style={styles.scrollView}>
          <View style={{paddingLeft: 10, paddingRight: 10}}>

            {/*  */}
            <Picker
              selectedValue={this.state.language}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({language: itemValue})
              }>
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
            {/*  */}

            <TextField
              ref={this.nameRef}
              value={data.name}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitName}
              returnKeyType='next'
              label='Name'
              error={errors.name}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.addressRef}
              value={data.address}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitAddress}
              returnKeyType='next'
              multiline={true}
              height={50}
              label='Address'
              error={errors.address}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.address2Ref}
              value={data.address2}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitAddress2}
              returnKeyType='next'
              multiline={true}
              height={50}
              label='Address 2'
              error={errors.address2}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.phoneRef}
              value={data.phone}
              keyboardType='number-pad'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPhone}
              returnKeyType='next'
              label='Phone Number'
              error={errors.phone}
              tintColor={'#000'}
              lineWidth={1}
            />
            <Province
              ref={this.provinceRef}
              data={this.state.provinces}
              selectedValue={this.state.provinceId}
              onSelect={this.onSelectProvince} />
            <City
              ref={this.cityRef}
              data={this.state.cities}
              selectedValue={this.state.cityId}
              onSelect={this.onSelectCity} />
            <TextField
              ref={this.postalcodeRef}
              value={data.postalcode}
              keyboardType={"number-pad"}
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPostalcode}
              returnKeyType='next'
              label='Postal Code'
              error={errors.postalcode}
              tintColor={'#000'}
              lineWidth={1}
            />
            <Button
              raised
              loading={this.state.buttonIsLoading}
              title={this.state.buttonIsLoading ? ' ' : 'SAVE'}
              containerViewStyle={styles.buttoContainer}
              buttonStyle={{
                borderRadius: 5
              }}
              onPress={this.onSubmit}
              backgroundColor='#c91a43' 
              color='#fff'
              />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 16,
    backgroundColor: "#fff"
  },
  buttoContainer: {
    width: "100%",
    marginLeft: 0,
    marginTop: 10,
    borderRadius: 5
  }
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    listUserAddresses: state.userAddresses.addresses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetListUserAddress: (listUserAddresses) => dispatch(setListUserAddress(listUserAddresses)),
    onUnsetUser: () => dispatch(unsetUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddressForm);