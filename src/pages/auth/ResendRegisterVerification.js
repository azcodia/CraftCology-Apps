import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Keyboard
} from 'react-native';
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
import { postPublic } from '../../providers/Api';
import { showMessage } from 'react-native-flash-message';

export default class ResendRegisterVerification extends Component {
  
  constructor(props){
    super(props);
    this.state ={ 
      buttonIsLoading: false,
      email: '',
    };
    
    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');
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
    ['email']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitEmail() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.password.blur();
  }

  onSubmit() {
    let errors = {};

    ['email']
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

    Keyboard.dismiss();

    this.setState({
        buttonIsLoading: true,
    }, function(){

      let uri = 'auth/resend-register-verification';
      let params = {
        email: this.state.email
      };

      postPublic(uri, params).then(response => {
        this.setState({
          buttonIsLoading: false,
        });
        console.log(response);
        if (response.status == 200) {
          showMessage({
            message: response.data.message,
            type: 'success'
          });
          this.setState({
            email: ''
          });
          return;
        }

        showMessage({
          message: response.data.message,
          type: 'danger'
        });
      }).catch(error => {
        this.setState({
          buttonIsLoading: false,
        });
      });
    });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  _onPressFacebookLogin() {}
  _onPressGoogleLogin() {}

  render() {
    let { errors = {}, ...data } = this.state;

    return(
      <ScrollView keyboardShouldPersistTaps={"always"} keyboardDismissMode='on-drag'>
        <View style={styles.scrollView} keyboardShouldPersistTaps='handled'>
          <Image
            source={require('./../../images/logo.png')}
            style={styles.logo}
          />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <Text style={{
              textAlign: 'center',
              fontSize: 18,
              color: '#111',
              marginBottom: 30
            }}>
              Register Email Verification
            </Text>
            <Text>Enter email address to get email verification</Text>
            <TextField
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
            
            <Button
              raised
              loading={this.state.buttonIsLoading}
              title={this.state.buttonIsLoading ? ' ' : 'SEND EMAIL VERIFICATION'}
              containerViewStyle={styles.loginContainerButton}
              buttonStyle={{
                borderRadius: 5
              }}
              onPress={this.onSubmit}
              backgroundColor='#ff4545' 
              color='#fff'
              />
          </View>
        </View>
      </ScrollView>
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
  loginContainerButton: {
    width: '100%',
    marginLeft: 0,
    marginTop: 10,
    borderRadius: 5
  },
  registerButton: {
    marginLeft: 16,
    marginTop: 10
  },
  containerFacebookButton: {
    width: '100%',
    borderRadius: 5
  },
  containerGoogleButton: {
    width: '100%',
    borderRadius: 5
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    borderRadius: 5
  },
  googleButton: {
    backgroundColor: '#d62d20', 
    borderRadius: 5
  },
  buttonContainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginRight: 29, 
    marginTop: 28
  },
  signUpText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
