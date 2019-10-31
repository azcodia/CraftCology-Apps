/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Router, Scene, Drawer, Actions, Stack, Modal, Tabs } from 'react-native-router-flux';
import { Platform, BackHandler, StatusBar, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Setting from './pages/setting/Setting';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/cart/Cart';
import CartEdit from './pages/cart/CartEdit';
import OrderForm from './pages/cart/OrderForm';
import Customize from './pages/Customize';
import Account from './pages/Account';
import FilterPage from './pages/FilterPage';
import SplashScreen from 'react-native-splash-screen';
import ImageGallery from './pages/ImageGallery';
import Register from './pages/auth/Register';
import SearchPage from './pages/SearchPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ListConfirmPayment from './pages/payment/ListConfirmPayment';
import ConfirmPayment from './pages/payment/ConfirmPayment';
import Contact from './pages/Contact';
import BrowserLoad from './pages/BrowserLoad';
import Profile from './pages/setting/Profile';
import Password from './pages/setting/Password';


import TabIcon from './components/TabIcon';
import Billing from './pages/billing/Billing';
import BillingForm from './pages/billing/BillingForm';
import OrderStatus from './pages/order/OrderStatus';
import OrderStatusDetail from './pages/order/OrderStatusDetail';
import ShippingAddress from './pages/shipping-address/ShippingAddress';
import ShippingAddressForm from './pages/shipping-address/ShippingAddressForm';
import { Session, Global } from './helpers/Global';
import CheckoutSuccess from './pages/cart/CheckoutSuccess';
import CategoryAndFilter from './components/CategoryAndFilter';
import FlashMessage from "react-native-flash-message";
import HomeNavbar from './components/HomeNavbar';
import OrderHistory from './pages/order/OrderHistory';
import ResendRegisterVerification from './pages/auth/ResendRegisterVerification';
import ProductDetailNavbar from './components/ProductDetailNavbar';
import SetPassword from './pages/setting/SetPassword';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      doubleBackToExitPressedOnce: false
    }
  }

  componentDidMount() {
    // if (Platform.OS == 'android') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1500);
    // }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    if(Actions.currentScene === '_home'){
      if(this.state.doubleBackToExitPressedOnce) {
        BackHandler.exitApp();
      }
      Global.presentToast("Press back again to exit");
      this.setState({ doubleBackToExitPressedOnce: true });
      setTimeout(() => {
        this.setState({ doubleBackToExitPressedOnce: false });
      }, 2000);
      return true;
    }else if(Actions.currentScene === 'home'){}
  }
 
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar key="statusbar" backgroundColor="#fff" barStyle="dark-content" />
        <Router>
          <Scene initial={true} key="root" navigationBarStyle={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', elevation: 0 }} titleStyle={{ color: '#000', fontWeight: 'normal' }}>

            <Tabs key="maintab" tabs={true} tabBarPosition="bottom" swipeEnabled={false} hideNavBar tabBarStyle={{backgroundColor: '#fff'}} showLabel={false} lazy={true}>
              <Scene key={"home"} component={Home} title="CRAFTCOLOGY" navBar={HomeNavbar} drawerLockMode={'locked-closed'} icon={TabIcon} iconName="home" iconTitle="Home" />
              <Scene key={'category'} component={CategoryAndFilter} title="Categories" drawerLockMode={'locked-closed'} icon={TabIcon} iconName="filter" iconTitle="Categories" />
              <Scene key={'customize'} component={Customize} title="Customize" drawerLockMode={'locked-closed'} icon={TabIcon} iconName="book" iconTitle="Customize" />
              <Scene key={'account'} component={Account} drawerLockMode={'locked-closed'} icon={TabIcon} iconName="user" iconTitle="Account" hideNavBar/>
            </Tabs>

            <Scene key="imageGallery" component={ImageGallery} modal hideNavBar />
            <Scene key="search" component={SearchPage} />
            <Scene key="productDetail" component={ProductDetail}  navBar={ProductDetailNavbar} />
            <Scene key="setting" component={Setting} />
            <Scene key="cart" component={Cart} backTitle="Back" />
            <Scene key="cartEdit" component={CartEdit} />
            <Scene key="orderForm" component={OrderForm} />
            <Scene key="checkoutSuccess" component={CheckoutSuccess} />
            <Scene key="filterPage" headerBackTitle={""} component={FilterPage} />
            <Scene key="listConfirmPayment" component={ListConfirmPayment} />
            <Scene key="confirmPayment" component={ConfirmPayment} />
            <Scene key="profile" component={Profile} />
            <Scene key="password" component={Password} />
            <Scene key="setPassword" component={SetPassword} />
            <Scene key="contact" component={Contact} />
            <Scene key="browserLoad" component={BrowserLoad} />

            <Scene key="billingInfo" component={Billing} />
            <Scene key="billingInfoForm" component={BillingForm} />

            <Scene key="orderStatus" component={OrderStatus} />
            <Scene key="orderStatusDetail" component={OrderStatusDetail} />
            <Scene key="orderHistory" component={OrderHistory} />

            <Scene key="shippingAddress" component={ShippingAddress} />
            <Scene key="shippingAddressForm" component={ShippingAddressForm} />

            <Scene key="login" component={Login} hideNavBar navTransparent />
            <Scene key="forgotPassword" component={ForgotPassword} hideNavBar navTransparent />
            <Scene key="register" component={Register} hideNavBar navTransparent />
            <Scene key="resendRegisterVerification" component={ResendRegisterVerification} hideNavBar navTransparent />


          </Scene>
        </Router>
        <FlashMessage position="bottom" />
      </View>
    );
  }
}