import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity
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
import { Global, Session } from '../helpers/Global';
import { TextField } from 'react-native-material-textfield';

export default class Contact extends Component {

  static navigationOptions = {
    title: 'Contact Us'
  };
  
  constructor(props){
    super(props);
    this.state ={ 
      buttonIsLoading: false,
      name: '',
      phone: '',
      email: '',
      topic: '',
      comment: '',
      listForms: [
        'name',
        'phone',
        'email',
        'topic',
        'comment'
      ]
    };

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitTopic = this.onSubmitTopic.bind(this);
    this.onSubmitComment = this.onSubmitComment.bind(this);

    this.nameRef = this.updateRef.bind(this, 'name');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.topicRef = this.updateRef.bind(this, 'topic');
    this.commentRef = this.updateRef.bind(this, 'comment');
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

  onSubmitPhone() {
    this.phone.focus();
  }

  onSubmitEmail() {
    this.email.focus();
  }

  onSubmitTopic() {
    this.topic.blur();
  }

  onSubmitComment() {
    this.comment.blur();
  }

  onSubmit() {
    let errors = {};

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
      errors['email'] = 'Please enter a valid email address';
    }else {
        this.setState({
          buttonIsLoading: true,
      }, function(){
        

        console.log("Masuk Ke Api")
        fetch(Global.getBaseUrl() + 'api/v1/submit-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            topic: this.state.topic,
            comment: this.state.comment
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
        console.log(responseJson);
        Global.presentToast(responseJson.message);
        this.setState({
          buttonIsLoading: false,
        });
        if (responseJson.status == 200) {
          Global.presentToast(responseJson.message);
          Actions.pop();
        }
        })
        .catch((error) => {
          console.log(error);
        })
      });
    }

    if(this.state.phone.length < 10 || this.state.phone.length > 13) {
      errors['phone'] = 'Number not required';
    }else if(this.state.phone == null) {
      errors['phone'] = 'Should not be empty';
    }


    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    // console.log(this.state.name);
    // console.log(this.state.phone);
    // console.log(this.state.email);
    // console.log(this.state.topic);
    // console.log(this.state.comment);
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

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
            Do you have questions and comments? Fill in the following form and we are ready to help.
          </Text>
          <View style={{paddingLeft: 10, paddingRight: 10}}>
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
            <TextField
              ref={this.topicRef}
              value={data.topic}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitTopic}
              returnKeyType='next'
              label='Topic'
              error={errors.topic}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.commentRef}
              value={data.comment}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              multiline={true}
              height={50}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitComment}
              returnKeyType='done'
              label='Comment'
              error={errors.comment}
              tintColor={'#000'}
              lineWidth={1}
            />
          </View>
        </ScrollView>
        <Button
          raised
          loading={this.state.buttonIsLoading}
          title={this.state.buttonIsLoading ? ' ' : 'SUBMIT'}
          containerViewStyle={styles.containerButton}
          onPress={this.onSubmit}
          backgroundColor='#c91a43' 
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
