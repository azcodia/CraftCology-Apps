import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Dimensions,
  FlatList, 
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { 
  Text, 
  Button, 
  ListItem, 
  Icon, 
  Avatar 
} from 'react-native-elements';
import { 
  Global, 
  Session 
} from '../../helpers/Global';
import {
  removeCart,
  totalCartQty,
  removeCartQty
} from "./../../stores/actions/index";
import {
  deletePublic
} from '../../providers/Api';
import { Actions } from 'react-native-router-flux';
import Accordion from '@ercpereda/react-native-accordion';
import CartEmpty from '../../components/CartEmpty';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';

class Cart extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      models: [],
      image: [],
      refreshing: true,
      session: new Session(),
      user: null,
      isLoggedIn: null,
      dataSource: [],
      buttonIsLoading: false
    };
  }

  componentWillMount() {
    this._getData();
  }

  _getData() {
    this.setState({
      refreshing: false,
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getData();
  }

  renderSourceImage(item) {
    console.log(item, "renderSourceImage")
    // console.log(Global.getProductImageUrl() + item.image_name, "link Url Gambar")
    if (item.is_customize == true) {
      // return item.customize_image_name;
      if(item.image_name == null) {
        console.log("Gambar Kosong Di Api")
        return item.customize_image_name;
      }else {
        console.log("Gambar Tidak Kosong Di Api")
        return {
          uri: Global.getProductImageUrl() + item.image_name
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

  _onPressCheckout() {
    this.setState({
      buttonIsLoading: true
    });
    setTimeout(() => {
      this.setState({
        buttonIsLoading: false
      });

      if (this.props.isLoggedIn) {
        if (this.props.carts){
          Actions.orderForm({user:this.props.user, title: 'Order Form'});
        } else {
          Alert.alert(
            '',
            'Cart Empty',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          ) 
        }
      } else {
        showMessage({
          message: 'Please login before checkout',
          type: 'danger'
        })
        Actions.login();
      }

    }, 1000);
  }

  _onPressRemoveCart(item) {
    if(this.props.isLoggedIn == true) {
      this.removeCartAPI(item)
    }else {
      this.removeCartSession(item)
    }
  }

  removeCartSession(item) {
    console.log("remove cart")
    console.log(item.qty)
    let qtyCartKal = this.props.qtyCart.qtyCart - item.qty
    console.log("Setelah Di Remove Cart")
    console.log(qtyCartKal)
    let qtyCart = {
      qtyCart: qtyCartKal
    }
    this.props.onRemoveQtyCart();
    this.props.onCountQtyCart(qtyCart);

    this.setState({refreshing: true});
    this.props.onRemoveCart(item.unique_number);
    this.state.session.cartRemove(item).then(() => {
      setTimeout(() => {
        this._onRefresh();
      }, 1000);
    });
  }

  removeCartAPI(item) {
    var uri = "delete-cart"
    var body = {
      email: this.props.user.email,
      cart: [item]
    }
    console.log(body, "body")

    deletePublic(uri, body, headers= null).then(res => {
      console.log("remove cart")
      console.log(item.qty)
      let qtyCartKal = this.props.qtyCart.qtyCart - item.qty
      console.log("Setelah Di Remove Cart")
      console.log(qtyCartKal)
      let qtyCart = {
        qtyCart: qtyCartKal
      }
      this.props.onRemoveQtyCart();
      this.props.onCountQtyCart(qtyCart);

      this.setState({refreshing: true});
      this.props.onRemoveCart(item.unique_number);
      this.state.session.cartRemove(item).then(() => {
        setTimeout(() => {
          this._onRefresh();
        }, 1000);
      });
    })

  }

  _renderFlatListItem(item) {
    const QuantityGroup =
      <View style={{flexWrap: 'wrap', alignItems: 'flex-start', flexDirection:'row', height: '100%', justifyContent:"space-between", paddingTop:15, paddingBottom: 15}}>
        <Text style={{ paddingTop: 2, paddingRight:10 }}>Qty</Text>
        <Text style={{ paddingTop: 2, paddingRight:20 }}>{item.qty}</Text>
        <TouchableOpacity style = {{paddingRight:16}}>
          <Icon 
          onPress={() => {
            Alert.alert(
              '',
              'Are you sure to delete this item?',
              [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => this._onPressRemoveCart(item)},
              ],
              { cancelable: false }
            )
          }}
          name="md-trash" type="ionicon" size={25} color='#f44336'/>
        </TouchableOpacity>
      </View>;
    
    const Header = ({ isOpen }) =>
      <ListItem
        title={item.name}
        onPress={() => Actions.cartEdit({item: item, title: item.name})}
        containerStyle={{backgroundColor:'#fff'}}
        titleStyle={{marginLeft: 10}}
        subtitleStyle={{marginLeft: 10}}
        rightIcon={QuantityGroup}
        leftIcon={<Avatar
          size="small"
          rounded
          source={this.renderSourceImage(item)}
          onPress={() => {
            if (item.is_customize == true) {
              Actions.cartEdit({item: item, title: item.name});
            } else {
              Actions.productDetail({item: item, title: item.name});
            }
          }}
          activeOpacity={0.7}
        />}
      />;

    return (
      <Accordion
        underlayColor={'#ddd'}
        header={Header}
        duration={300}
        />
    );
  }

  render() {
    if (this.props.carts.length <= 0) {
      return <CartEmpty/>;
    } 
    return(
      <View style={styles.container}>
        <FlatList
          data={this.props.carts}
          contentContainerStyle={styles.flatListContentContainerStyle}
          refreshControl={
            <RefreshControl 
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}/>
          }
          renderItem={({item}) => this._renderFlatListItem(item)}
        />
        <Button
          full
          loading={this.state.buttonIsLoading}
          title={this.state.buttonIsLoading ? ' ' : 'SUBMIT YOUR PRE ORDER'}
          buttonStyle={{backgroundColor: "#ff4545"}}
          containerViewStyle={{marginLeft:-0,width:"100%"}}
          onPress={() => this._onPressCheckout()} />
      </View>
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
    padding: 16
  },
  contentContainer: {
    borderWidth: 2,
    borderColor: '#CCC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContentContainerStyle: {
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
  }
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    carts: state.carts.cart,
    qtyCart: state.qtyCart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRemoveCart: cartId => dispatch(removeCart(cartId)),
    onCountQtyCart: (qtyCart) => dispatch(totalCartQty(qtyCart)),
    onRemoveQtyCart: ()=> dispatch(removeCartQty())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);