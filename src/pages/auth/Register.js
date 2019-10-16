import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { 
  Button,
  Text,
  SocialIcon
} from 'react-native-elements';
import { 
  GoogleSignin, 
  statusCodes 
} from 'react-native-google-signin';
import { 
  AccessToken, 
  LoginManager
} from 'react-native-fbsdk';
import {
  setUser
} from "./../../stores/actions/index";
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { Global, Session } from '../../helpers/Global';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextField } from 'react-native-material-textfield';
import { showMessage } from 'react-native-flash-message';
import { postPublic } from '../../providers/Api';
import { connect } from 'react-redux';
import PasswordInputText from 'react-native-hide-show-password-input';

class Register extends Component {
  
  constructor(props){
    super(props);
    this.state ={ 
      buttonIsLoading: false,
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      spinnerVisible: false,
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
    this.onSubmitPassword = this.onSubmitPassword.bind(this);

    this.firstnameRef = this.updateRef.bind(this, 'firstname');
    this.lastnameRef = this.updateRef.bind(this, 'lastname');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');
  }

  async componentWillMount() {
    await GoogleSignin.configure(
      Global.getGoogleSigninParams()
    );
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

    if(this.state.email.includes("@gmail")) {
      this.onPressGoogleSignIn()
    }
    
    // Check
    // console.log(this.state.firstname)
    // console.log(this.state.lastname)
    // console.log(this.state.phone)
    // console.log(this.state.email)
    // console.log(this.state.password)
    // // firebase_token: 'xxx'
    // Check Tutup

    this.state.listForms
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Should not be empty';
        } else {
          if ('password' === name && value.length < 6) {
            errors[name] = 'Too short';
          }
        }
      });
    
    if (!this.state.password) {
      errors['password'] = 'Should not be empty';
    } else if (this.state.password.length < 6) {
      errors['password'] = 'Too short';
    }

    var cekEmail = this.state.email;

    if(!cekEmail.includes("@")) {
      errors['email'] = 'email not required';
    }else if(!cekEmail) {
      errors['email'] = 'email not required';
    }

    if(this.state.phone.length < 10 || this.state.phone.length > 13) {
      errors['phone'] = 'Number not required';
    }


    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    Keyboard.dismiss();

    this.setState({
        buttonIsLoading: true,
    }, function(){

      fetch(Global.getBaseUrl() + 'api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          phone: this.state.phone,
          email: this.state.email,
          password: this.state.password,
          confirm_password: this.state.password,
          // firebase_token: 'xxx'
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
      console.log(responseJson);
      Global.presentToast(responseJson.message);
      this.setState({
        buttonIsLoading: false,
      });
      if (responseJson.status == 201) {
        Global.presentToast(responseJson.message);
        Actions.reset('maintab');
      }
      })
      .catch((error) => {
        console.log("Error: ");
        console.log(error);
      })
    });
  }

  processSocialMediaSignIn(firebaseUserParams, social) {
    var uri = 'auth/social-media-login';
    var body = {
      email: firebaseUserParams.additionalUserInfo.profile.email,
      uid: firebaseUserParams.user.uid,
      fullname: firebaseUserParams.user.displayName,
      social: social
    };
    postPublic(uri, body).then(response => {
      this.setState({
        spinnerVisible: false
      });
      if (response.status == 200) {
        showMessage({
          message: response.data.message,
          type: "success",
          icon: { icon: "success", position: "left" },
        });
        const session = new Session();
        session.setUser(response.data.data);
        this.props.onSetUser(response.data.data);
        Actions.pop();
      } else {
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        showMessage({
          message: response.data.message,
          type: "danger",
          icon: { icon: "danger", position: "left" },
        });
      }
    });
  }

  async onPressGoogleSignIn() {
    console.log("Terdeteksi @gmail")
    try {
      console.log("Click")
      this.setState({spinnerVisible:true});
      let data = await GoogleSignin.signIn();
      let credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      console.log("Credential")
      console.log(credential)
      const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
      console.log("Current User: ")
      console.log(currentUser)
      if (currentUser) {
        // access to api login with social media
        this.processSocialMediaSignIn(currentUser, 'google');
        console.log(currentUser);
      }
    } 
    catch (error) {
      console.log("Gagal Click");
      console.log(error);
      this.setState({spinnerVisible:false});
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Global.presentToast("You canceled google sign in request");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Global.presentToast("Sign in in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Global.presentToast("Google play service not available");
      } else {
        Global.presentToast("Sign in failed, please try again");
      }
    }
  }

  async onPressFacebookSignIn() {
    try {
      this.setState({spinnerVisible:true});
      const loginPermission = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
      if (loginPermission.isCancelled) {
        throw new Error('You canceled facebook sign in request');
      }
      console.log(`Login success with permissions: ${loginPermission.grantedPermissions.toString()}`);
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining the users access token');
      }
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
      if (currentUser) {
        // access to api login with social media
        this.processSocialMediaSignIn(currentUser, 'facebook');
        console.log(currentUser);
      }
    } catch (error) {
              // onSubmitEditing={this.onSubmitPassword}
      Global.presentToast(error.message);
              // onSubmitEditing={this.onSubmitPassword}
      this.setState({spinnerVisible:false});
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    let { errors = {}, ...data } = this.state;

    return(
      <KeyboardAwareScrollView>
      <ScrollView keyboardShouldPersistTaps={"always"}>
        <View style={styles.scrollView} keyboardShouldPersistTaps='handled'>
          <Image
            source={require('./../../images/logo.png')}
            style={styles.logo}
          />
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
            <PasswordInputText
              ref={this.passwordRef}
              value={data.password}
              secureTextEntry={true}
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={(value) => this.setState({password:value})}
              returnKeyType='done'
              label='Password'
              error={errors.password}
              maxLength={30}
              characterRestriction={20}
              tintColor={'#000'}
              lineWidth={1}
            />
            <Button
              raised
              loading={this.state.buttonIsLoading}
              title={this.state.buttonIsLoading ? ' ' : 'SIGN UP'}
              containerViewStyle={styles.loginContainerButton}
              buttonStyle={{
                borderRadius: 5
              }}
              onPress={this.onSubmit}
              backgroundColor='#ff4545' 
              color='#fff'
              />
              <View style={{ marginTop: 20 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>OR</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', marginTop: 16}}>
                <View style={{flex: 0.5}}>
                  <SocialIcon
                    title='Google'
                    style={{borderRadius: 5, margin: 0, marginRight: 5, backgroundColor: '#4285f4'}}
                    button
                    onPress={() => this.onPressGoogleSignIn()()}
                    type='google'
                  />
                </View>
                <View style={{flex: 0.5}}>
                  <SocialIcon
                    title='Facebook'
                    style={{borderRadius: 5, margin: 0, marginLeft: 5}}
                    button
                    onPress={() => this.onPressFacebookSignIn()}
                    type='facebook'
                  />
                </View>
              </View>
              <View style={{ marginTop: 30 }}>
                <TouchableOpacity onPress={() => Actions.replace('login')} activeOpacity={0.8} >
                  <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Have an account ? Sign in</Text>
                </TouchableOpacity>
              </View>
              <Spinner visible={this.state.spinnerVisible} textContent={"Please wait .."} textStyle={{color: '#FFF'}} />
          </View>
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
  },
  formInputStyle: {
    borderBottomColor: "#888", 
    borderBottomWidth: 1, 
    padding: 1
  },
  formInputContainerStyle: {
    marginBottom: 10
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
    onSetUser: user => dispatch(setUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);