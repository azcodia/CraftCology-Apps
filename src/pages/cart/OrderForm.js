import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  FlatList, 
  RefreshControl
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { 
  Text, 
  Button, 
  ListItem, 
  CheckBox } from 'react-native-elements';
import { Global, Session } from '../../helpers/Global';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker'
import AddressDropdown from '../../components/AddressDropdown';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { 
  removeAllCart, setListUserAddress, unsetUser
} from '../../stores/actions/index';
import { postFilePublic, getPublic } from '../../providers/Api';

class OrderForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      date: null,
      models: [],
      image: [],
      checkedWA: true,
      checked: true,
      refreshing: true,
      session: new Session(),
      isHidden : false,
      singleAdress : false,
      MultipleAdress : false,
      listAddress: [],
      ships: [],
      tags: [],
      multiples: [],
      email: this.props.user.email,
      phone: this.props.user.phone,
      address: '',
      tag: 'Reseller',
      shippingAddress: '',
      listForms: [
        'email',
        'phone'
      ]
    };
    console.log(this.props.listUserAddresses);
    this.state.tags = [{
      value: 'Corporate',
    }, {
      value: 'Reseller',
    }, {
      value: 'Personal',
    }];

    this.state.ships = [{
      value: 'Multiple Address',
    }, {
      value: 'Single Address',
    }];

    this.onFocus = this.onFocus.bind(this);
    this.onChangeText = this.onChangeText.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');
    this.phoneRef = this.updateRef.bind(this, 'phone');

    console.log(this.props.carts);
  }

  componentWillMount() {
    this._getData();
    this.getAddresses();
  }

  _getData() {
    this.setState({
      refreshing: false,
      models: this.props.carts,
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getData();
  }

  renderSourceImage(item) {
    if (item.is_customize == true) {
      if (item.customize_image_name) {
        return item.customize_image_name;
      } else {
        return {
          uri: Global.getBaseUrl() + 'assets/images/icon/cart.png'
        }
      }
    }

    if (item.image_name) {
      return {
        uri: Global.getProductImageUrl() + item.image_name
      };
    } else {
      return Global.getBaseUrl() + 'assets/images/icon/cart.png';
    }
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

      let formdata = new FormData();
      formdata.append("tag", this.state.tag);
      formdata.append("shipping_type", this.state.shippingAddress);
      formdata.append("customer_address_id", this.state.address);
      formdata.append("contact_phone", this.state.phone);
      formdata.append("contact_email", this.state.email);
      formdata.append("details", this.state.shippingAddress);
      if (!this.state.checkedWA == true) {
        formdata.append("contact_whatsapp", this.state.phone);
      }
      for (i=0;i<this.state.models.length;i++) {
        let model =this.state.models[i];
        formdata.append("details["+i+"][product_id]", model.id);
        formdata.append("details["+i+"][product_attribute_id]", "0");
        formdata.append("details["+i+"][name]", model.name);
        formdata.append("details["+i+"][image_name]", model.image_name);
        formdata.append("details["+i+"][product_attribute_name]", "");
        formdata.append("details["+i+"][qty]", model.qty);
        formdata.append("details["+i+"][price]", model.price);
        formdata.append("details["+i+"][customer_address_id]", model.customer_address_id == 'undefined' ? '' : model.customer_address_id);
        formdata.append("details["+i+"][note]", model.note);
        formdata.append("details["+i+"][date]", model.date);
        formdata.append("details["+i+"][is_customize]", model.is_customize == 1 ? 1 : 0);
        for (j=0;j<model.referances.length;j++) {
          let image = [];
          image['name'] = model.referances[j].name;
          image['type'] = model.referances[j].type;
          image['uri'] = model.referances[j].uri;
          formdata.append("referances["+model.id+"][]", image);
          formdata.append("notes["+model.id+"][]", model.referances[j].note);
        }
      }

      let headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.props.user.token
      };
      postFilePublic('cart/checkout', formdata, headers).then(responseJson => {
        this.setState({
          buttonIsLoading: false,
        });
        if (responseJson.status == '200' || responseJson.status == '201') {
          showMessage({
            message: responseJson.data.message,
            type: 'success'
          });
          this.props.onRemoveAllCart();
          Actions.reset("checkoutSuccess", {
            title: 'Thank you',
            user: this.props.user,
            data: responseJson.data.data
          });
          this.state.session.cartRemoveAll().then(() => {
            
          });
          return;
        }
        showMessage({
          message: responseJson.data.message,
          type: 'info'
        });
        if (responseJson.status == 401) {
          this.props.onUnsetUser();
          Actions.login();
          return;
        }
      }).catch(error => {
        Global.presentToast(error);
        this.setState({
          buttonIsLoading: false,
        });
        console.log(error);
      });
    });
  }

  renderItem(item, index) {
    const QuantityGroup = <Text style={{ paddingTop: 2, paddingRight:10 }}>QTY : {item.qty}</Text>;

    const DeliveryDateLabel = item.date != null ?
      <Text style={{
        fontSize: 11,
        marginTop: 5
      }}>
        Delivery Date
      </Text>
      :
      <View style={{
        fontSize: 11,
        marginTop: 10,
      }}/>;

    const LeftAvatar =  
      <Image
        style={{width: 150, height: 150, marginLeft: -10}}
        source={this.renderSourceImage(item)}
        onPress={() => Actions.productDetail({item: item, title: item.name})}
      />;

    const Title = 
      <View style={{flex: 1, padding: 10, marginTop: -80, flexDirection: 'column', justifyContent: 'flex-start'}}>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
          {QuantityGroup}
        </View>
        <Text style={{ marginTop: 10 }}>
          {item.note}
        </Text>
      </View>;

  return (
    <View style={{ borderBottomColor: '#888', borderBottomWidth: 1, padding: 10 }}>
      <ListItem
        style={{paddingTop: 10, paddingBottom: 10}}
        title={Title}
        containerStyle={{backgroundColor:'#fff', borderBottomWidth: 0}}
        titleStyle={{
          marginTop: 10
        }}
        hideChevron
        leftIcon={LeftAvatar}
      />
      {this.renderDropdownMultiple(item, index)}
      {DeliveryDateLabel}
      <DatePicker
        style={{width:'100%', borderWidth:0, borderColor: '#fff', textAlign: 'left'}}
        showIcon = {false}
        date={item.date}
        mode="date"
        placeholder="Delivery Date"
        format="YYYY-MM-DD"
        minDate={new Date()}
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
            borderBottomColor: '#ddd'
          },
          placeholderText:{
            textAlign: 'left',
            color: '#898989'
          }
        }}
        style={{
          width: 'auto'
        }}
        onDateChange={(date) => {this.setMultipleDeliveryDate(item, index, date)}}
      />
    </View>
  );
}

  getAddresses() {
    let uri = 'customer-address';
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
    };
    getPublic(uri, headers).then(response => {
      this.props.onSetListUserAddresses(response.data.data);
      this.setState({
        listAddress: response.data.data
      });
      console.log(this.props.listUserAddresses);
    }).catch(error => {
      this.props.onUnsetUser();
      Actions.login();
    });;
  }

  renderDropdownList() {
    if (!this.state.isHidden) {
      return (
        <Dropdown
          label='Select Shipping Address'
          data={this.state.ships}
          user={this.props.user}
          onChangeText={(value) => {
            this.setState({shippingAddress: value});
            this.state.ships.map(()=>{
              if(value=='Single Address'){
                this.setState({singleAdress: true});
                } else {
                this.setState({singleAdress: false});
                }
              })
          }}
        />
      );
    }
  }

  renderDropdownSingle() {
    if (this.state.singleAdress) {
      return (
        <AddressDropdown
          label='Ship to'
          data={this.props.listUserAddresses}
          user={this.props.user}
          selectedValue={this.state.address}
          onSelect={(itemIndex, itemValue) => this.setState({address: itemIndex})}
        />
      );
    }
  }

  setMultipleDeliveryDate(item, index, date) {
    let multiples = this.state.models;
    multiples[index].increment = index;
    multiples[index].product_id = item.id;
    multiples[index].date = date;
    this.setState({
      models: multiples
    });
  }

  setMultipleSingleAddress(item, index, address) {
    let multiples = this.state.models;
    multiples[index].increment = index;
    multiples[index].product_id = item.id;
    multiples[index].customer_address_id = address;
    this.setState({
      models: multiples
    });
  }

  renderDropdownMultiple(item, index) {
    console.log(this.state.shippingAddress);
    if ((this.state.singleAdress == false) && (this.state.shippingAddress == 'Multiple Address')) {
      return (
        <AddressDropdown
          label='Ship to'
          data={this.props.listUserAddresses}
          user={this.props.user}
          onSelect={(itemIndex, itemValue) => this.setMultipleSingleAddress(item, index, itemIndex)}
        />
      );
    }
  }

  onSubmitEmail() {
    this.email.focus();
  }

  onSubmitPhone() {
    this.phone.focus();
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
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
          <ScrollView
          showsVerticalScrollIndicator={false} style={styles.innerContainer}>
            <View>
              {/* <Dropdown
                label='Select Tag'
                data={this.state.tags}
                onChangeText={(item) => {
                  this.setState({tag: item});
                  this.state.tags.map(() => {
                    if(item == 'Personal'){
                      this.setState({isHidden: true});
                      this.setState({singleAdress: true});
                    } else {
                      this.setState({isHidden: false});
                    }

                  })
                  console.log(item)
                }}
              /> */}
              {this.renderDropdownList()}
              {this.renderDropdownSingle()}

              <FlatList
                data={this.state.models}
                contentContainerStyle={styles.flatListContentContainerStyle}
                // flexWrap='wrap'
                // horizontal={false}
                // numColumns='2'
                refreshControl={
                  <RefreshControl 
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}/>
                }
                renderItem={({item, index}) => this.renderItem(item, index)}
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
                //onSubmitEditing={this.onSubmitEmail}
                returnKeyType='next'
                label='Email Address'
                error={errors.email}
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
                //onSubmitEditing={this.onSubmitPhone}
                returnKeyType='next'
                label='Phone Number'
                error={errors.phone}
                tintColor={'#000'}
                lineWidth={1}
              />
              <CheckBox
                checked={!this.state.checkedWA}
                onPress={() => this.setState({checkedWA: !this.state.checkedWA})}
                title='Whatsapp Number (Optional)'
                checkedColor='#6bc3cd'
                containerStyle={{
                  backgroundColor: 'transparent', 
                  borderWidth: 0,
                  marginTop: -10,
                  marginLeft: -10
                }}
              />

              <CheckBox
                checked={!this.state.checked}
                onPress={() => this.setState({checked: !this.state.checked})}
                title='I Agree to the Terms & Conditions'
                checkedColor='#6bc3cd'
                containerStyle={{
                  backgroundColor: 'transparent', 
                  borderWidth: 0,
                  marginLeft: -10
                }}
              />
            </View>
        </ScrollView>
        <Button
          full
          loading={this.state.buttonIsLoading}
          title={this.state.buttonIsLoading ? ' ' : 'CONFIRM'}
          disabled={this.state.checked}
          disabledStyle={{backgroundColor: "#ffa8a8"}}
          buttonStyle={{backgroundColor: "#ff4545"}}
          containerViewStyle={{marginLeft:-0, marginTop: 10, width:"100%"}}
          onPress={() => this.onSubmit()}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff'
  },
  innerContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16

  },
  contentContainer: {
    borderWidth: 2,
    borderColor: '#CCC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContentContainerStyle: {
    borderTopWidth: 2,
    borderTopColor: '#888',
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    padding: 0
  },
  cardImageStyle: {
    height: 100,
  },
  cardTitleTextStyle: {
    marginBottom: 8, 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#111',
  },
  touchableOpacityStyle: {
    position: 'absolute',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    left: (Dimensions.get('window').width / 2) - 25,
    bottom: 10,
    margin: 'auto',
    backgroundColor: '#c91a43',
    borderRadius: 5
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
  },
  icon: {
    marginRight: 0,
    alignSelf: 'center'
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    height: 45
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
    carts: state.carts.cart,
    listUserAddresses: state.userAddresses.addresses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRemoveAllCart: () => dispatch(removeAllCart()),
    onUnsetUser: () => dispatch(unsetUser()),
    onSetListUserAddresses: (listUserAddresses) => dispatch(setListUserAddress(listUserAddresses))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderForm);