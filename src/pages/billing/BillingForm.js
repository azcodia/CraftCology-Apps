import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import { Button } from 'react-native-elements';
import { Global, Session } from '../../helpers/Global';
import { TextField } from 'react-native-material-textfield';
import { showMessage } from 'react-native-flash-message';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  unsetUser
} from "./../../stores/actions/index";
import { requestPublic } from '../../providers/Api';

class BillingForm extends Component {

  constructor(props){
    super(props);
    Actions.refresh({title: this.props.headerTitle});
    this.state ={ 
      models: [],
      session: new Session(),
      buttonIsLoading: false,
      formUrl: (this.props.item != null) ? 'customer-billing/' + this.props.item.id : 'customer-billing',
      formMethod: (this.props.item != null) ? 'PATCH' : 'POST',
      firstname: (this.props.item != null) ? this.props.item.billing_name : '',
      lastname: (this.props.item != null) ? this.props.item.billing_account : '',
      phone: (this.props.item != null) ? this.props.item.billing_code : '',
      listForms: [
        'firstname',
        'lastname',
        'phone',
      ]
    };

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitFirstname = this.onSubmitFirstname.bind(this);
    this.onSubmitLastname = this.onSubmitLastname.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);

    this.firstnameRef = this.updateRef.bind(this, 'firstname');
    this.lastnameRef = this.updateRef.bind(this, 'lastname');
    this.phoneRef = this.updateRef.bind(this, 'phone');

    console.log(this.state.formUrl);
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

  onSubmitPassword() {
    this.password.blur();
  }

  onSubmit() {
    let errors = {};

    this.state.listForms
      .forEach((name) => {
        let value = this[name].value();
        if (!value) {
          errors[name] = 'Should not be empty';
        }
      });

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({
        buttonIsLoading: true,
    }, function(){

      var uri = this.state.formUrl;
      var body = {
        billing_name: this.state.firstname,
        billing_account: this.state.lastname,
        billing_code: this.state.phone
      };
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.token
      };
      requestPublic(this.state.formMethod, uri, body, headers).then(response => {
        this.setState({
          spinnerVisible: false
        });
        if (response.status == 200) {
          showMessage({
            message: response.data.message,
            type: "success",
            icon: { icon: "success", position: "left" },
          });
          console.log("Cek User : " + response.data.data)
          // this.props.onSetUser(response.data.data);
          // this.props.onSetListUserAddresses(response.data.data.customer_addresses);
          Actions.pop();
          Actions.billingInfo({user:this.props.user});
          return;
        }else

        // showMessage({
        //   message: response.data.message,
        //   type: "danger",
        //   icon: { icon: "danger", position: "left" },
        // });
        if (response.status == 401) {
          this.props.onUnsetUser();
          Actions.login();
          return;
        }
      });
    });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    let { errors = {}, ...data } = this.state;

    return <ScrollView style={styles.scrollView} keyboardDismissMode="on-drag">
        <View>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <TextField ref={this.firstnameRef} value={data.firstname} keyboardType="default" autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} onFocus={this.onFocus} onChangeText={this.onChangeText} onSubmitEditing={this.onSubmitFirstname} returnKeyType="next" label="Bank Name" error={errors.firstname} tintColor={"#000"} lineWidth={1} />
            <TextField ref={this.lastnameRef} value={data.lastname} keyboardType="default" autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} onFocus={this.onFocus} onChangeText={this.onChangeText} onSubmitEditing={this.onSubmitLastname} returnKeyType="next" label="Billing Account" error={errors.lastname} tintColor={"#000"} lineWidth={1} />
            <TextField ref={this.phoneRef} value={data.phone} keyboardType="phone-pad" autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} onFocus={this.onFocus} onChangeText={this.onChangeText} onSubmitEditing={this.onSubmitPhone} returnKeyType="done" label="Billing Number" error={errors.phone} tintColor={"#000"} lineWidth={1} />
            <Button raised loading={this.state.buttonIsLoading} title={this.state.buttonIsLoading ? " " : "SAVE"} containerViewStyle={styles.buttoContainer} buttonStyle={{ borderRadius: 5 }} onPress={this.onSubmit} backgroundColor="#c91a43" color="#fff" />
          </View>
        </View>
      </ScrollView>;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 16,
    backgroundColor: '#fff'
  },
  buttoContainer: {
    width: '100%',
    marginLeft: 0,
    marginTop: 10,
    borderRadius: 5
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
    // onUnsetUser: () => dispatch(unsetUser()),
    // onSetUser: user => dispatch(setUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingForm);