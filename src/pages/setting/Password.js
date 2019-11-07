import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { 
  Button
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import PasswordInputText from 'react-native-hide-show-password-input';
import { postPublic } from '../../providers/Api';
import { connect } from 'react-redux';
import {
  unsetUser
} from "./../../stores/actions/index";
import { showMessage } from 'react-native-flash-message';

class Password extends Component {

  static navigationOptions = {
    title: 'Change Password'
  };
  
  constructor(props){
    super(props);
    this.state ={ 
      buttonIsLoading: false,
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
      listForms: []
    };

    console.log(this.props.user.token);
    this.onSubmit = this.onSubmit.bind(this);
    this.oldpasswordRef = this.updateRef.bind(this, 'oldpassword');
    this.newpasswordRef = this.updateRef.bind(this, 'newpassword');
    this.confirmpasswordRef = this.updateRef.bind(this, 'confirmpassword');
  }

  onSubmit() {
    let errors = {};

    if (!this.state.oldpassword) {
      errors['oldpassword'] = 'Should not be empty';
    } else if (this.state.oldpassword.length < 6) {
      errors['oldpassword'] = 'Too short';
    }

    if (!this.state.newpassword) {
      errors['newpassword'] = 'Should not be empty';
    } else if (this.state.newpassword.length < 6) {
      errors['newpassword'] = 'Too short';
    }

    if (!this.state.confirmpassword) {
      errors['confirmpassword'] = 'Should not be empty';
    } else if (this.state.confirmpassword.length < 6) {
      errors['confirmpassword'] = 'Too short';
    }
    
    if (this.state.newpassword != this.state.confirmpassword) {
      errors['confirmpassword'] = 'new password and confirm password do not match';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({
        buttonIsLoading: true,
    }, function(){

      let uri = 'auth/change-password';
      let params = {
        current_password: this.state.oldpassword,
        new_password: this.state.newpassword,
        confirm_password: this.state.confirmpassword
      };
      let headers = {
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.user.token
        },
      };

      postPublic(uri, params, headers)
      .then(response => {
        console.log(response, "cek Response")
        // console.log(response.data.message, "Cek Error")
        this.setState({
          buttonIsLoading: false,
        });
        if (response.data.status == 200) {
          showMessage({
            message: response.data.message,
            type: 'success'
          });
          Actions.pop();
          return;
        }
        // showMessage({
        //   message: response.data.message,
        //   type: 'danger'
        // });
        // unauthorized
        else if (response.data.status == 401) {
          // this.props.onUnsetUser();
          // Actions.push('login');
          showMessage({
            message: response.data.message,
            type: 'danger'
          });
        }else if(response.data.status == 400) {
          showMessage({
            message: response.data.message,
            type: 'danger'
          });
        }
      }).catch(error => {
        console.log(error.message, "Cek Error++")
        this.props.onUnsetUser();
        this.setState({
          buttonIsLoading: false,
        });
        Actions.login();
      });
    });
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

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    let { errors = {}, ...data } = this.state;

    return(
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
          <View style={{paddingLeft: 10, paddingRight: 10}}>
          <PasswordInputText
              ref={this.oldpasswordRef}
              value={data.oldpassword}
              secureTextEntry={true}
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={(value) => this.setState({oldpassword:value})}
              returnKeyType='next'
              label='Old Password'
              error={errors.oldpassword}
              maxLength={30}
              characterRestriction={20}
              tintColor={'#000'}
              lineWidth={1}
            />
            <PasswordInputText
              ref={this.newpasswordRef}
              value={data.newpassword}
              secureTextEntry={true}
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={(value) => this.setState({newpassword:value})}
              returnKeyType='next'
              label='New Password'
              error={errors.newpassword}
              maxLength={30}
              characterRestriction={20}
              tintColor={'#000'}
              lineWidth={1}
            />
            <PasswordInputText
              ref={this.confirmpasswordRef}
              value={data.confirmpassword}
              secureTextEntry={true}
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={(value) => this.setState({confirmpassword:value})}
              returnKeyType='done'
              label='Repeat New Password'
              error={errors.confirmpassword}
              maxLength={30}
              characterRestriction={20}
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
    onUnsetUser: () => dispatch(unsetUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Password);