import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { 
  Button,
  Text
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { TextField } from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker'
import PaymentToDropdown from './../../components/PaymentToDropdown';
import { connect } from 'react-redux';
import {
  updateOrder, unsetUser
} from "./../../stores/actions/index";
import { postPublic } from '../../providers/Api';
import { showMessage } from 'react-native-flash-message';

class ConfirmPayment extends Component {

  static navigationOptions = {
    title: 'Confirm Payment'
  };
  
  constructor(props){
    super(props);
    this.state = { 
      date: null,
      buttonIsLoading: false,
      ordercode: this.props.orderSelected.code_order,
      visibleDatepicker: false,
      paymentdate: new Date(),
      paymenttotal: '',
      paymenttotal1: '',
      accountname: '',
      bankname: '',
      paymentto: '',
      listForms: [
        'ordercode',
        'paymenttotal',
        'paymenttotal1',
        'accountname',
        'bankname'
      ]
    };


    if (this.props.orderSelected.status == 'INVOICE_1') {
      this.state.paymenttotal = this.props.orderSelected.amount_1.toString();
    } else if (this.props.orderSelected.status == 'INVOICE_2') {
      this.state.paymenttotal = this.props.orderSelected.amount_2.toString();
    }

    console.log(this.state.paymenttotal);
    console.log("Cek Status Pembayaran: ")
    console.log(this.props.orderSelected)

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitOrdercode = this.onSubmitOrdercode.bind(this);
    this.onSubmitPaymenttotal = this.onSubmitPaymenttotal.bind(this);
    this.onSubmitPaymenttotal1 = this.onSubmitPaymenttotal1.bind(this);
    this.onSubmitAccountname = this.onSubmitAccountname.bind(this);
    this.onSubmitBankname = this.onSubmitBankname.bind(this);

    this.ordercodeRef = this.updateRef.bind(this, 'ordercode');
    this.paymenttotalRef = this.updateRef.bind(this, 'paymenttotal');
    this.paymenttotalRef1 = this.updateRef.bind(this, 'paymenttotal1');
    this.accountnameRef = this.updateRef.bind(this, 'accountname');
    this.banknameRef = this.updateRef.bind(this, 'bankname');
  }

  setDate(newDate) {
    this.setState({chosenDate: newDate})
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

  onSubmitOrdercode() {
    this.ordercode.focus();
  }

  onSubmitPaymenttotal() {
    this.paymenttotal.focus();
  }

  onSubmitPaymenttotal1() {
    if(this.props.orderSelected.status == 'INVOICE_2') {
      this.paymenttotal1.focus();
    }
  }

  onSubmitAccountname() {
    this.accountname.focus();
  }

  onSubmitBankname() {
    this.bankname.focus();
  }

  onSubmit() {
    let errors = {};
    console.log("Total Bayar: "+this.state.paymenttotal)
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

    if(this.props.orderSelected.status == 'INVOICE_2') {
      if(this.state.paymenttotal !== this.state.paymenttotal1) {
        errors['paymenttotal1'] = 'Your total payment does not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({
        buttonIsLoading: true,
    }, function(){

      let uri = 'order/confirm-payment';
      let params = {
        order_code: this.state.ordercode,
        payment_date: this.state.paymentdate,
        shopping_total: this.state.paymenttotal,
        payment_to: this.state.paymentto,
        account_name: this.state.accountname,
        bank_name: this.state.bankname
      };
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.token
      };

      postPublic(uri, params, headers).then(response => {
        console.log(response);
        this.setState({
          buttonIsLoading: false,
        });
        if (response.status == 200) {
          showMessage({
            message: response.data.message,
            type: 'success'
          });
          this.props.onUpdateOrder(response.data.data);
          Actions.pop();
          return;
        }
        showMessage({
          message: response.data.message,
          type: 'danger'
        });
        if (response.status == 401) {
          this.props.onUnsetUser();
          Actions.login();
          return;
        }
      }).catch(error => {
        this.props.onUnsetUser();
        this.setState({
          refreshing: false,
        });
        Actions.login();
      });
    });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  showDatepicker = () => this.setState({ visibleDatepicker: true });

  hideDatepicker = () => this.setState({ visibleDatepicker: false });

  handleDatepicker = (date) => {
    this.setState({
      paymentdate: date
    });
    console.log('A date has been picked: ', date);
    this.hideDatepicker();
  };

  onSelectPaymentTo = (id) => {
    this.setState({
      paymentto: id
    });
  }

  renderPaymentDateLabel() {
    if (this.state.paymentdate) {
      return (
        <Text style={{
          fontSize: 11,
          marginTop: 5
        }}>
          Payment Date
        </Text>
      );
    } else {
      return (
        <View style={{
          fontSize: 11,
          marginTop: 10,
        }}/>
      );
    }
  }

  render() {
    let { errors = {}, ...data } = this.state;

    return(
      <View style={{flex: 1, backgroundColor: '#d5d5d5'}}>
        <ScrollView style={styles.scrollView}>
          <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
            <TextField
              ref={this.ordercodeRef}
              value={data.ordercode}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitOrdercode}
              returnKeyType='next'
              label='Invoice Number'
              error={errors.ordercode}
              tintColor={'#000'}
              lineWidth={1}
              editable={false} 
              selectTextOnFocus={false}
            />
            {this.renderPaymentDateLabel()}
            <DatePicker
              style={{width:'100%', borderWidth:0, borderColor: '#fff', textAlign: 'left'}}
              showIcon = {false}
              date={this.state.paymentdate}
              mode="date"
              placeholder="Payment Date"
              format="YYYY-MM-DD"
              // minDate={new Date()}
              maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  borderWidth:0, borderColor: '#fff',alignItems: 'flex-start',
                  borderBottomWidth: 1, 
                  borderBottomColor: '#888'
                },
                placeholderText:{
                  textAlign: 'left',
                  color: '#898989'
                }
              }}
              style={{
                width: 'auto'
              }}
              onDateChange={(date) => {this.setState({paymentdate: date})}}
            />
            {/* Disabled */}
            <TextField
              editable={
                this.props.orderSelected.status == 'INVOICE_1' ? true : false
              }
              ref={this.paymenttotalRef}
              value={data.paymenttotal}
              keyboardType='number-pad'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPaymenttotal}
              returnKeyType='next'
              label='Payment Total'
              error={errors.paymenttotal}
              tintColor={'#000'}
              lineWidth={1}
            />
            {/* Disabled Tutup */}

            {/* Enabled */}
            {
              this.props.orderSelected.status == 'INVOICE_1'
              ?
              <View style={{width: 0, height:0, zIndex: -10}}>
                <TextField
                  ref={this.paymenttotalRef1}
                  // value={data.paymenttotal1}
                  value={this.props.orderSelected.status == 'INVOICE_1' ? data.paymenttotal : data.paymenttotal}
                  keyboardType='number-pad'
                  autoCapitalize='none'
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPaymenttotal1}
                  returnKeyType='next'
                  label='Payment Total'
                  error={errors.paymenttotal1}
                  tintColor={'#d5d5d5'}
                  lineWidth={1}
                  errorColor={"#d5d5d5"}
                  baseColor={"#d5d5d5"}
                />
              </View>
              :
                <TextField
                  ref={this.paymenttotalRef1}
                  value={data.paymenttotal1}
                  keyboardType='number-pad'
                  autoCapitalize='none'
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitPaymenttotal1}
                  returnKeyType='next'
                  label='Payment Total'
                  error={errors.paymenttotal1}
                  tintColor={'#000'}
                  lineWidth={1}
                />
            }
            {/* Enabled Tutup */}

            <PaymentToDropdown
              selectedValue={this.state.paymentto}
              onSelect={this.onSelectPaymentTo}
              />
            <TextField
              ref={this.accountnameRef}
              value={data.accountname}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitAccountname}
              returnKeyType='next'
              label='Account Name'
              error={errors.accountname}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.banknameRef}
              value={data.bankname}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitBankname}
              returnKeyType='done'
              label='Bank Name'
              error={errors.bankname}
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
  },
  hairline: {
    backgroundColor: '#d5d5d5',
    height: 1,
    width: '100%'
  },
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    orderSelected: state.orders.orderSelected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateOrder: (order) => dispatch(updateOrder(order)),
    onUnsetUser: () => dispatch(unsetUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPayment);