import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { 
  Button,
  Text,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Icon
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Global, Session } from '../../helpers/Global';
import { TextField } from 'react-native-material-textfield';
import { patchPublic } from '../../providers/Api';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import {
  setUser,
  setListUserAddress,
  unsetUser
} from "./../../stores/actions/index";

class Profile extends Component {

  static navigationOptions = {
    title: 'Profile'
  };
  
  constructor(props){
    super(props);
    this.state ={ 
      buttonIsLoading: false,
      firstname: this.props.user ? this.props.user.firstname : '',
      lastname: this.props.user ? this.props.user.lastname : '',
      phone: this.props.user ? this.props.user.phone : '',
      email: this.props.user ? this.props.user.email : '',
      listForms: [
        'firstname',
        'lastname',
        'phone',
        'email'
      ]
    };

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitFirstname = this.onSubmitFirstname.bind(this);
    this.onSubmitLastname = this.onSubmitLastname.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);

    this.firstnameRef = this.updateRef.bind(this, 'firstname');
    this.lastnameRef = this.updateRef.bind(this, 'lastname');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.emailRef = this.updateRef.bind(this, 'email');
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

  onSubmitFirstname() {
    this.firstname.focus();
  }

  onSubmitLastname() {
    this.lastname.focus();
  }

  onSubmitPhone() {
    this.phone.focus();
  }

  onSubmitEmail() {
    this.email.focus();
  }

  onSubmit() {
    let errors = {};

    this.state.listForms
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Should not be empty';
        } 
        if (name === 'lastname') {
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

    // this.setState({
    //     buttonIsLoading: true,
    // }, function(){

    //   let uri = 'customer/update';
    //   let params = {
    //     firstname: this.state.firstname,
    //     lastname: this.state.lastname,
    //     phone: this.state.phone,
    //     email: this.state.email
    //   };
    //   let headers = {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + this.props.user.token
    //   };

    //   patchPublic(uri, params, headers).then(responseJson => {
    //     console.log(responseJson);
    //     this.setState({
    //       buttonIsLoading: false,
    //     });
    //     if (responseJson.status == 200) {
    //       showMessage({
    //         message: responseJson.data.message,
    //         type: 'success'
    //       });
    //       let session = new Session();
    //       session.setUser(responseJson.data.data);
    //       this.props.onSetUser(responseJson.data.data);
    //       Actions.pop({refresh: {user: responseJson.data.data, profile: true}});
    //       return;
    //     }

    //     if (responseJson.status == 400) {

    //       if (responseJson.data.validators.email != null) {
    //         showMessage({
    //           message: responseJson.data.validators.email,
    //           type: 'warning'
    //         });
    //         return;
    //       }

    //       showMessage({
    //         message: responseJson.data.message,
    //         type: 'info'
    //       });
    //     }
    //     showMessage({
    //       message: responseJson.data.message,
    //       type: 'danger'
    //     });
    //     // unauthorized
    //     if (responseJson.status == 401) {
    //       this.props.onUnsetUser();
    //       Actions.login();
    //     }
    //   }).catch(error => {
    //     this.props.onUnsetUser();
    //     this.setState({
    //       buttonIsLoading: false,
    //     });
    //     Actions.login();
    //   });
    // });
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

  updateRef(name, ref) {
    this[name] = ref;
  }

  _onPressFacebookLogin() {}
  _onPressGoogleLogin() {}

  render() {
    let { errors = {}, ...data } = this.state;

    return(
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
          <Text style={{
            fontSize: 14,
            marginTop: 10,
            marginBottom: 10,
            textAlign: 'center'
          }}>
            Change your Profile Information
          </Text>
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <TextField
              ref={this.firstnameRef}
              value={data.firstname}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitFirstname}
              returnKeyType='next'
              label='First Name'
              error={errors.firstname}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.lastnameRef}
              value={data.lastname}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitLastname}
              returnKeyType='next'
              label='Last Name'
              error={errors.lastname}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.phoneRef}
              value={data.phone}
              keyboardType='phone-pad'
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
            <TextField
              disabled="true"
              ref={this.emailRef}
              value={data.email}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEmail}
              returnKeyType='next'
              label='Email Address'
              error={errors.email}
              tintColor={'#000'}
              lineWidth={1}
            />
          </View>
        </ScrollView>
        <Button
          raised
          loading={this.state.buttonIsLoading}
          title={this.state.buttonIsLoading ? ' ' : 'SAVE'}
          containerViewStyle={styles.containerButton}
          onPress={this.onSubmit}
          backgroundColor='#6bc3cd' 
          color='#fff'
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 16
  },
  logo: {
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 100,
    height: 100
  },
  containerButton: {
    width: '100%',
    marginLeft: -0
  }
});


const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetUser: (user) => dispatch(setUser(user)),
    onUnsetUser: () => dispatch(unsetUser()),
    onSetListUserAddresses: (addresses) => dispatch(setListUserAddress(addresses))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);