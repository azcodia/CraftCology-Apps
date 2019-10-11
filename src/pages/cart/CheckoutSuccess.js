import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  ScrollView,
  BackHandler,
  StatusBar,
  FlatList
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Global, Session } from '../../helpers/Global';
import { Actions } from 'react-native-router-flux';
import Accordion from '@ercpereda/react-native-accordion';

export default class CheckoutSuccess extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: this.props.user,
      isLoggedIn: null,
      session: new Session(),
      data: this.props.data
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    console.log("result 2 - " + this.state.isLoggedIn);
    const isLoggedIn = await this.state.session.getIsLoggedIn();
    console.log("result 3 - " + isLoggedIn);
    this.setState({isLoggedIn: isLoggedIn});
    console.log("result 4 - " + this.state.isLoggedIn);
    if (isLoggedIn) {
      this.state.session.getUser().then((result) => {
        this.setState({
          user: result,
          name: result.firstname + ' ' + result.lastname
        });
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    Actions.reset('maintab');
  }

  handleBackPress = () => {
    Actions.reset('maintab');
    return true;
  }

  _productImage(image) {
    if (image) {
      return Global.getProductImageUrl() + image;
    } else {
      return Global.getBaseUrl() + 'assets/images/icon/cart.png';
    }
  }

  renderProductItem(item) {
    const Header = ({ isOpen }) =>
      <View style={styles.accordionHeaderStyle}>
        <View style={{width: 200}}>
          <Text>{item.product_name}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text style={{ textAlign: 'right' }}>{isOpen ? '-' : '+'}</Text>
        </View>
      </View>;
    
    const Content = (
      <View style={styles.contentContainerStyle}>
        <Image
          source={{uri: this._productImage(item.product_image)}}
          style={{width:150, height: 150, marginBottom:10, marginLeft: 'auto', marginRight: 'auto' }}
          resizeMode="cover"
        />
        <Text style={styles.contentLabelStyle}>Item Name</Text>
        <Text style={styles.contentTitleStyle}>{item.product_name}</Text>
        <Text style={styles.contentLabelStyle}>Qty</Text>
        <Text style={styles.contentTitleStyle}>{item.qty}</Text>
        <Text style={styles.contentLabelStyle}>Notes</Text>
        <Text style={styles.contentTitleStyle}>{item.customize_note}</Text>
        <Text style={styles.contentLabelStyle}>Delivery Date</Text>
        <Text style={styles.contentTitleStyle}>{item.delivery_date_c}</Text>
        <Text style={styles.contentLabelStyle}>Shipping Address</Text>
        <Text style={styles.contentTitleStyle}>{ item.customer_address.full_address }</Text>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}} />
      </View>);

    return (
      <View style={{flex: 1}}>
        <Accordion
          header={Header}
          content={Content}
        />
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <StatusBar key="statusbar" backgroundColor="#fff" barStyle="dark-content" />
        <View style={{ padding: 16 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.contentLabelStyle}>Order Code</Text>
            <Text style={styles.contentTitleStyle}>{this.state.data.code_order}</Text>
            <Text style={styles.contentLabelStyle}>Email</Text>
            <Text style={styles.contentTitleStyle}>{this.state.data.contact_email}</Text>
            <Text style={styles.contentLabelStyle}>Phone Number</Text>
            <Text style={styles.contentTitleStyle}>{this.state.data.contact_phone}</Text>
          </View>
          <FlatList
            data={this.state.data.order_details}
            contentContainerStyle={styles.flatListContentContainerStyle}
            renderItem={({item}) => this.renderProductItem(item)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View>
            <Button
              title={"BACK TO SHOP"}
              onPress={() => Actions.reset('maintab')}
              buttonStyle={{backgroundColor: "#ff4545"}}
              />
          </View>
          <View>
            <Button
              title={"VIEW MY ORDER"}
              onPress={() => Actions.push('orderStatus', {user: this.state.user})}
              buttonStyle={{backgroundColor: "#ff4545"}}
              />
          </View>
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  flatListContentContainerStyle: {
    padding: 0
  },
  list: {
    flex: 1,
    padding: 16,
    paddingBottom: 0
  },
  accordionHeaderStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2'
  },
  contentLabelStyle: {
    paddingBottom: 5,
    color: '#000000',
    fontWeight: 'bold'
  },
  contentTitleStyle: {
    paddingBottom: 5,
    color: '#a5a5a5',
    textAlign: 'right'
  },
  contentContainerStyle: {
    display: 'flex',
    backgroundColor: '#e2e2e2',
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  buttonContainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingBottom: 16
  }
});