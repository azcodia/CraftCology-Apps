import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard
} from 'react-native';
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
  Global, 
  Session 
} from '../../helpers/Global';
import {
  setUser,
  unsetUser,
  setListUserAddress
} from "./../../stores/actions/index";

import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { TextField } from 'react-native-material-textfield';
import Spinner from 'react-native-loading-spinner-overlay';
import { postPublic } from './../../providers/Api';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import PasswordInputText from "react-native-hide-show-password-input";

class Login extends Component {
  
  constructor(props){
    super(props);
    this.state ={ 
      buttonIsLoading: false,
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      isSigninInProgress: false,
      spinnerVisible: false
    };
    
    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');
    console.log(this['email']);
  }

  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }

  async componentWillMount() {
    await GoogleSignin.configure(
      Global.getGoogleSigninParams()
    );
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
  }

  onSubmitPassword() {
  }

  onSubmit() {
    let errors = {};

    if(this.state.email.includes("@gmail")) {
      this.onPressGoogleSignIn()
    }else {
        ['email']
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
      if (!cekEmail.includes("@")) {
        errors['email'] = 'Please enter a valid email address';
      } else if (!cekEmail) {
        errors['email'] = 'Should not be empty';
      }

      if (Object.keys(errors).length > 0) {
        this.setState({ errors });
        return;
      }

      Keyboard.dismiss();

      this.setState({
          buttonIsLoading: true,
      });

      // setCart
      let i = 0;
      let result = []

      if(this.props.carts.cart.length == 0) {
        result=[]
      }else {
        do {
          let cart = this.props.carts.cart[i]

          // let cartGet = {
          //   cart
          // }

          result.push(cart)
          i++;
        } while(i < this.props.carts.cart.length)
      }
      console.log("Cek Result Data");
      console.log(result);
      // setCart End

      var uri = 'auth/login';
      var body = {
        email: this.state.email,
        password: this.state.password,
        firebase_token: 'xxx',
        login_device_id: 'xxx',
        // cart: result,
        cart: []
      };
      postPublic(uri, body).then(response => {
        this.setState({
          buttonIsLoading: false,
        });
        if (response.status == 200) {
          const session = new Session();
          session.setUser(response.data.data);
          this.props.onSetUser(response.data.data);
          this.props.onSetListUserAddresses(response.data.data.customer_addresses);
          console.log(response);
          showMessage({
            message: response.data.message,
            type: "success",
            icon: { icon: "success", position: "left" },
          });
          Actions.pop();
        } else {
          showMessage({
            message: response.data.message,
            type: "danger",
            icon: { icon: "danger", position: "left" },
          });
        }
      }).catch(error => {
        console.log(error.message);
      });
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  processSocialMediaSignIn(firebaseUserParams, social) {

    // setCart
    let i = 0;
    let result = []

    if(this.props.carts.cart.length == 0) {
      result=[]
    }else {
      do {
        let cart = this.props.carts.cart[i]

        // let cartGet = {
        //   cart
        // }

        result.push(cart)
        i++;
      } while(i < this.props.carts.cart.length)
    }
    console.log("Cek Result Data");
    console.log(result);
    // setCart End

    var uri = 'auth/social-media-login';
    var body = {
      email: firebaseUserParams.additionalUserInfo.profile.email,
      uid: firebaseUserParams.user.uid,
      fullname: firebaseUserParams.user.displayName,
      social: social,
      // cart: result
      cart: []
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
        this.props.onSetListUserAddresses(response.data.data.customer_addresses);
        this.postCart()
        Actions.pop();
        console.log("Balikan API: ");
        console.log(response);
        console.log(this.props.userAddresses);
        console.log("Cek Props User: ")
        console.log(this.props.user.id)
        console.log("Cek Props Cart")
        console.log(this.props.carts.cart)
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

  // Post Cart Ke API
  postCart() {

    var uri = "cart/"+this.props.user.id
    result = [];
    console.log("Cek Props Keranjang: ")
    console.log(this.props.carts.cart)
      for(let i=0; i<this.props.carts.cart.length; i++) {
        let cartResponse = this.props.carts.cart[i]
        // let cartDataFilter = {
        //   product_id: cartResponse.id,
        //   qty: cartResponse.qty,
        //   customize_image: cartResponse.customize_image_name == null ? null : cartResponse.customize_image_name.name,
        //   // notes_image:   cartResponse.customize_image_name.note
        //   notes_image: cartResponse.customize_image_name == null ? null : cartResponse.customize_image_name.note 
        // }
        // result.push(cartDataFilter)
        var uri = "cart/"+this.props.user.id
        var body = {
          cart: {
            product_id: cartResponse.id,
            qty: cartResponse.qty,
            customize_image: cartResponse.customize_image_name == null ? null : cartResponse.customize_image_name.name,
            notes_image: cartResponse.customize_image_name == null ? null : cartResponse.customize_image_name.note
          }
        }
        postPublic(uri, body).then(res => {
          if(res.status == 200) {
            console.log("Kembalian Api Cart")
            console.log(res)
          }else {
    
          }
        })
      }
    // console.log("cek Result :")
    // console.log(JSON.parse(result))

    // var uri = "cart/"+this.props.user.id
    // var body = {
    //   cart: result
    // }

  }
  // Post Cart Ke API END


  async onPressGoogleSignIn() {
    try {
      this.setState({spinnerVisible:true});
      let data = await GoogleSignin.signIn();
      let credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
      if (currentUser) {
        // access to api login with social media
        this.processSocialMediaSignIn(currentUser, 'google');
        console.log(currentUser);
      }
    } catch (error) {
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
      LoginManager.setLoginBehavior('WEB_ONLY');
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
      Global.presentToast(error.message);
      this.setState({spinnerVisible:false});
    }
  }

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
              value={data.password}
              ref={this.passwordRef}
              secureTextEntry={true}
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={(value) => this.setState({password: value})}
              returnKeyType={'done'}
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
              title={this.state.buttonIsLoading ? ' ' : 'SIGN IN'}
              containerViewStyle={styles.loginContainerButton}
              buttonStyle={{
                borderRadius: 5
              }}
              onPress={this.onSubmit}
              backgroundColor='#ff4545' 
              color='#fff'
              />
              <View style={{flex: 1, flexDirection: 'row', marginTop: 16}}>
                <View style={{flex: 0.5}}>
                  <SocialIcon
                    title='Google'
                    style={{borderRadius: 5, margin: 0, marginRight: 5, backgroundColor: '#4285f4'}}
                    button
                    onPress={() => this.onPressGoogleSignIn()}
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
              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'stretch',
                marginTop: 20
              }}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30}}>
                  <View style={{justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start'}}>
                    <Text onPress={() => Actions.replace('resendRegisterVerification')} style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 12, color: '#888'}}>Registration cannot be verified?</Text>
                  </View>
                  <View style={{justifyContent: 'flex-end', alignSelf: 'flex-end', alignItems: 'flex-end'}}>
                    <Text onPress={() => Actions.replace('forgotPassword')} style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 12, color: '#888' }}>Forgot Password?</Text>
                  </View>
                </View>
                
                <View>
                  <TouchableOpacity onPress={() => Actions.replace('register')} activeOpacity={0.8} >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Need an account ? Sign up now</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Spinner visible={this.state.spinnerVisible} textContent={"Please wait .."} textStyle={{color: '#FFF'}} />
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

const mapStateToProps = state => {
  return {
    user: state.user.user,
    carts: state.carts,
    isLoggedIn: state.user.isLoggedIn,
    userAddresses: state.userAddresses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetUser: user => dispatch(setUser(user)),
    onUnsetUser: () => dispatch(unsetUser()),
    onSetListUserAddresses: (listUserAddresses) => dispatch(setListUserAddress(listUserAddresses))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);