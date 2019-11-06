import React, { Component } from 'react';
import { 
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  Session, 
  Global 
} from '../helpers/Global';
import { 
  Button, 
  Avatar, 
  Icon, 
  ListItem 
} from'react-native-elements';
import {
  unsetUser,
  removeAllCart,
  removeCartQty,
} from "./../stores/actions/index";
import { Actions } from 'react-native-router-flux';
import { GoogleSignin } from 'react-native-google-signin';
import { LoginManager } from 'react-native-fbsdk';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';

class Account extends Component {

  constructor(props){
    super(props);
    this.state = { 
      session: new Session(),
      signOutButtonIsLoading: false,
    };
    console.log(this.props.user);
  }

  _onPressSignIn() {
    Actions.login();
  }

  _onPressSignUp() {
    Actions.register();
  }

  onConfirmSignOut() {
    Alert.alert(
      '',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this._onPressSignOut()},
      ],
      { cancelable: false }
    )
  }

  async _onPressSignOut() {
    this.setState({
      signOutButtonIsLoading: true,
    });
    this.props.onRemoveAllCart();
    this.props.onRemoveQtyCart();
    await GoogleSignin.configure(
      Global.getGoogleSigninParams()
    );
    await GoogleSignin.signOut();
    await LoginManager.logOut();
    this.state.session.logout().then((value) => {
      setTimeout(() => {
        this.setState({
          isLoggedIn: null,
          signOutButtonIsLoading: false
        });
        showMessage({
          message: value ? value : "Logout success",
          type: "success",
          icon: { icon: "success", position: "left" },
        });
        this.props.onUnsetUser();
        Actions.reset('maintab');
        Actions.refresh('maintab');
      }, 1000);
    });
  }

  _onPressSetting() {
    Actions.setting();
  }

  onPressOrderStatus() {
    if (this.props.isLoggedIn) {
      Actions.orderStatus({user:this.props.user});
    } else {
      Actions.login();
    }
  }

  onPressOrderHistory() {
    if (this.props.isLoggedIn) {
      Actions.orderHistory();
    } else {
      Actions.login();
    }
  }

  _renderHeaderAuth() {
    if (this.props.isLoggedIn) {
      return (
        <View style={{ flex: 1, position: 'absolute', width: '100%', left: 0}}>
          <View style={{width: '100%', flex: 1, flexDirection: 'row', position: 'absolute', top: 30}}>
            <View style={{width: '20%', padding: 10}}>
              <Avatar
                rounded
                source={require('./../images/user.png')}
                width={50}
                height={50}
                activeOpacity={0.7}
                containerStyle={{
                  marginLeft: 5
                }}
                />
            </View>
            <View style={{width: '75%', marginTop: 5}}>
              <Text 
                style={{
                  fontSize: 18,
                  color: '#000',
                  fontWeight: '400',
                  marginTop: 16,
                  marginLeft: 5
                }}
              >
                {this.props.user.firstname + ' ' + this.props.user.lastname}
              </Text>
            </View>
          </View> 
        </View>
      );
    }
    return (
      <View style={{flex: 1, flexDirection: 'row', position: 'absolute', top: 30}}>
        <View style={{width: '48%', padding: 10}}>
          <Avatar
            rounded
            source={require('./../images/user.png')}
            width={50}
            height={50}
            activeOpacity={0.7}
            containerStyle={{
              marginLeft: 5
            }}
            />
        </View>
        <View style={{width: '50%', marginTop: 5}}>
          <View style={{flexDirection: 'row', padding: 10}}>
            <View style={{width: '48%', padding: 5}}>
              <Button 
                title="sign in" 
                onPress={() => this._onPressSignIn()}
                raised
                containerViewStyle={{
                  width: '100%',
                  borderRadius: 5
                }}
                buttonStyle={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#ff4545'
                }}
                />
            </View>
            <View style={{width: '50%', padding: 5}}>
              <Button 
                title="register" 
                onPress={() => this._onPressSignUp()}
                raised
                containerViewStyle={{
                  width: '100%',
                  borderRadius: 5
                }}
                buttonStyle={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#ff4545'
                }}
                />
            </View>
          </View>
        </View>
      </View> 
    );
  }

  componentDidFocus() {
    console.log("test");
  }

  renderSignout() {
    if (this.props.isLoggedIn) {
      return (
        <Button 
          loading={this.state.signOutButtonIsLoading} 
          title={this.state.signOutButtonIsLoading ? ' ' : 'Logout'} 
          onPress={() => this.onConfirmSignOut()} 
          backgroundColor='#ff4545' 
          color='#fff' 
          containerViewStyle={{
            marginTop: 10,
            borderRadius: 5,
            width: '100%',
            marginLeft: 0
          }}
          buttonStyle={{
            borderRadius: 5
          }}
        />
      );
    }
  }

  renderProfile() {
    if (this.props.isLoggedIn) {
      return (
        <View>
          <Text style={{ marginBottom: 5, marginTop: 10 }}>Profile</Text>
          <View style={{backgroundColor: '#fff'}}>
            <ListItem
              key={1}
              title={"My Profile"}
              leftIcon={{ name: 'account-circle', type: 'material-community' }}
              onPress={() => Actions.profile({user:this.props.user})}
            />
            {this.renderPassword()}
          </View>
        </View>
      )
    }
  }

  renderPassword() {
    let newPassword;
    if (this.props.user.is_password == 0) {
      newPassword = (
        <ListItem
          key={0}
          title={"Set Password"}
          leftIcon={{ name: 'security-account', type: 'material-community' }}
          onPress={() => Actions.setPassword()}
        />
      );
    } else {
      newPassword = (
        <ListItem
            key={2}
            title={"Change Password"}
            leftIcon={{ name: 'security-account', type: 'material-community' }}
            onPress={() => Actions.password({user:this.props.user})}

          />
      );
    }

    return newPassword;
  }

  render() {
    let confirmPayment;
    if (this.props.isLoggedIn) {
      confirmPayment = (
        <ListItem
          key={0}
          title={"Confirm Payment"}
          leftIcon={{ name: 'payment', type: 'material-icon' }}
          onPress={() => Actions.listConfirmPayment()}
        />
      );
    }

    return(
      <SafeAreaView style={{flex: 1}}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Image
            source={require('./../images/background.jpg')}
            style={{ height: 130, width: '100%' }}
          />
          {this._renderHeaderAuth()}
          <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ marginBottom: 5 }}>Account</Text>
            <View style={{backgroundColor: '#fff', borderRadius: 5}}>
              {confirmPayment}
              <ListItem
                key={1}
                title={"Order Status"}
                leftIcon={{ name: 'reorder', type: 'font-awesome' }}
                onPress={() => this.onPressOrderStatus()}
              />
              <ListItem
                key={3}
                title={"Order History"}
                leftIcon={{ name: 'history', type: 'material-comunity' }}
                onPress={() => this.onPressOrderHistory()}
              />
              <ListItem
                key={4}
                title={"Shipping Address"}
                leftIcon={{ name: 'address', type: 'entypo' }}
                onPress={() => {
                  if (this.props.isLoggedIn) {
                    Actions.shippingAddress({user:this.props.user});
                  } else {
                    Actions.login();
                  }
                }}
              />
              <ListItem
                key={5}
                title={"Billing Info"}
                leftIcon={{ name: 'money', type: 'font-awesome' }}
                onPress={() => {
                  if (this.props.isLoggedIn) {
                    Actions.billingInfo({user:this.props.user});
                  } else {
                    Actions.login();
                  }
                }}
              />
            </View> 
            {this.renderProfile()}
            <Text style={{ marginBottom: 5, marginTop: 10 }}>Others</Text>
            <View style={{backgroundColor: '#fff'}}>
            <ListItem
                key={6}
                title={"Spesial Offers"}
                leftIcon={{ name: 'application', type: 'material-community' }}
                onPress={() => Actions.spesialOfferPages()}
              />
              <ListItem
                key={6}
                title={"Materials"}
                leftIcon={{ name: 'application', type: 'material-community' }}
                onPress={() => Actions.materialPages()}
              />
              <ListItem
                key={6}
                title={"About Us"}
                leftIcon={{ name: 'application', type: 'material-community' }}
                onPress={() => Actions.browserLoad({title: 'About Us', url: 'about-us-mobile'})}
              />
              <ListItem
                key={7}
                title={"Contact Us"}
                leftIcon={{ name: 'contact-mail', type: 'material-community' }}
                onPress={() => Actions.contact()}
              />
              <ListItem
                key={8}
                title={"How to Order"}
                leftIcon={{ name: 'list-alt', type: 'font-awesome' }}
                onPress={() => Actions.browserLoad({title: 'How to Order', url: 'how-to-order-mobile'})}
              />
              <ListItem
                key={9}
                title={"Term and Condition"}
                leftIcon={{ name: 'list', type: 'entypo' }}
                onPress={() => Actions.browserLoad({title: 'Term and Condition', url: 'terms-and-conditions-mobile'})}
              />
              <ListItem
                key={10}
                title={"Privacy Policy"}
                leftIcon={{ name: 'list', type: 'entypo' }}
                onPress={() => Actions.browserLoad({title: 'Privacy Policy', url: 'privacy-police-mobile'})}
              />
            </View>
            {this.renderSignout()}
            <Text style={{ marginBottom: 5, marginTop: 10, fontSize: 12 }}>Version {Global.getAppVersion()}</Text>
          </View>
        </ScrollView>
      </View>
      </SafeAreaView>
    );
  }
}


const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUnsetUser: () => dispatch(unsetUser()),
    onRemoveAllCart: () => dispatch(removeAllCart()),
    onRemoveQtyCart: ()=> dispatch(removeCartQty())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);