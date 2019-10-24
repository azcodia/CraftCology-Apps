/**
 * Class Custom
 * @author Hendri Gunawan <hendri.gnw@gmail.com>
 */

import { AsyncStorage, Platform, Alert, ToastAndroid } from 'react-native';
import { Actions } from 'react-native-router-flux';
const Intl = require('react-native-intl');
import RNFetchBlob from 'rn-fetch-blob';
import { showMessage, hideMessage } from "react-native-flash-message";


/* rupiahFormat */
export function currencyIndonesianFormat(labelValue) 
{
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? Math.abs(Number(labelValue)) / 1.0e+9 + " Miliar"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? Math.abs(Number(labelValue)) / 1.0e+6 + " Juta"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? Math.abs(Number(labelValue)) / 1.0e+3 + " Ratus Ribu"

    : Math.abs(Number(labelValue));
}

export class Global {

  static TEST_MODE = true;

  static getBaseUrl() {
    if (this.TEST_MODE == true) {
      return 'https://craftcology.cranium.id/';
    }
    return 'http://craftcology.com/';
  }

  static getAppVersion() {
    return '1.2.30';
  }

  static presentToast(message) {  
    showMessage({
      message: message,
      type: "info",
    });
  }

  static getLocaleID() {
    return 'id-ID';
  }

  static getFormattedCurrency(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  }

  static getUniqueNumber() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  static getProductImageUrl() {
    return this.getBaseUrl() + 'backend/uploads/';
  }

  static async downloadFile(url) {
    try {
      let dirs = RNFetchBlob.fs.dirs;
      filePath = RNFetchBlob.fs.dirs.DownloadDir;
      RNFetchBlob
      .config({
          path: filePath,
          fileCache: true,
          addAndroidDownloads : {
              useDownloadManager : true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification : true,
              // Optional, but recommended since android DownloadManager will fail when
              // the url does not contains a file extension, by default the mime type will be text/plain
              //mime : 'application/pdf',
              //description : 'File downloaded by download manager.'
          }
      })
      .fetch('GET', url)
      .then((res) => {
        // open the document directly
        RNFetchBlob.ios.previewDocument(res.path())
        // or show options
        // RNFetchBlob.ios.openDocument(res.path())
      });
    } catch(error) {
      console.log(error);
    }
  }

  static getGoogleSigninParams() {
    return {
      // webClientId: '904681701182-g0np9ukpr4j72g81r72k5v91k48up3ut.apps.googleusercontent.com',
      webClientId: '203626662554-md56rvo42t27gjar100co7mopgab1bf1.apps.googleusercontent.com',
      offlineAccess: false
    };
  }
}

export class Session {

  /**
   * @param {*} item {id,name,qty,price}
   */
  cartAdd(item) {
    try {
      this.cartGet().then((response) => {
        item.total = item.price * item.qty;
        if (response.length == 0 || response == null) {
          AsyncStorage.setItem("cart", JSON.stringify([item]));
          return true;
        }
        let result = [];
        let isItemAdded = false;
        for (let i=0; i<response.length; i++) {
          let cartResponse = response[i];
          if (cartResponse.id == item.id) {
            cartResponse.qty += item.qty;
            cartResponse.price = item.price;
            cartResponse.total = cartResponse.qty * cartResponse.price;
            cartResponse.product_attribute_id = 0;
            cartResponse.product_attribute_name = "";
            cartResponse.customer_address_id = null;
            cartResponse.date = null;
            isItemAdded = true;
          }
          result.push(cartResponse);
        }
        console.log("Add Cart Ke Session");
        console.log(result);
        if (isItemAdded == false) {
          result.push(item);
        }
        
        AsyncStorage.setItem("cart", JSON.stringify(result));
      });
    } catch (error) {
      console.error(error);
    }
  }

  async cartAddQty(item, qty) {
    try {
      this.cartGet().then((response) => {
        let result = [];
        for (let i=0; i<response.length; i++) {
          let cartResponse = response[i];
          if (cartResponse.unique_number == item.unique_number) {
            cartResponse.qty = qty;
            cartResponse.total = cartResponse.qty * cartResponse.price;
          }
          result.push(cartResponse);
        }
        AsyncStorage.setItem("cart", JSON.stringify(result));
        return this.cartGet();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async cartUpdate(item) {
    try {
      this.cartGet().then((response) => {
        let result = [];
        for (let i=0; i<response.length; i++) {
          let cartResponse = response[i];
          if (cartResponse.unique_number == item.unique_number) {
            cartResponse.qty = item.qty;
            cartResponse.referances = item.referances;
            cartResponse.note = item.note
          }
          result.push(cartResponse);
        }
        console.log("Update Cart Ke Session");
        console.log(result);
        AsyncStorage.setItem("cart", JSON.stringify(result));
        return this.cartGet();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async cartRemove(item) {
    try {
      this.cartGet().then((response) => {
        if (response.length == 0 || response == null) {
          AsyncStorage.setItem("cart", JSON.stringify([]));
          return true;
        }
        let result = [];
        for (let i=0; i<response.length; i++) {
          let cartResponse = response[i];
          if (cartResponse.unique_number == item.unique_number) {
            continue;
          }
          result.push(cartResponse);
        }
        AsyncStorage.setItem("cart", JSON.stringify(result));
        return this.cartGet();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async cartRemoveAll() {
    try {
      let response = await AsyncStorage.setItem("cart", JSON.stringify([]));
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async cartGet() {
    try {
      let response = await AsyncStorage.getItem("cart");
      if (response == null) {
        return JSON.parse("[]");
      }
      return JSON.parse(response);
    } catch (error) {
      return JSON.parse("[]");
    }
  }

  async getUser() {
    try {
      let response = await AsyncStorage.getItem("user");
      return JSON.parse(response);
    } catch (error) {
      console.error(error);
    }
  }

  async getIsLoggedIn() {
    const isLoggedIn = await this.getUser();
    if(isLoggedIn != null) {
      return true;
    } else {
      return false;
    }
  }

  setUser(user) {
    try {
      AsyncStorage.setItem("user", JSON.stringify(user));
      this.isLoggedIn = true;
      this.user = user;
    } catch(error) {

    }
  }

  async logout() {
    const user = await this.getUser();
    if (user == null) {
      return;
    }
    
    fetch(Global.getBaseUrl() + 'api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {

      AsyncStorage.setItem("user", "");
      return responseJson;

    })
    .catch((error) => {
      console.error(error);
    });
  }

  forceLogout() {
    AsyncStorage.setItem("user", "");
    Global.presentToast("Session expired");
    Actions.reset('maintab');
    return true;
  }
}