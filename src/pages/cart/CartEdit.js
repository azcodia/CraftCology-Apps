import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  FlatList, 
  RefreshControl,
  TextInput,
  Alert,
  NativeModules,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, Button, ListItem, ButtonGroup, FormInput, Icon, Avatar } from 'react-native-elements';
import {
  updateCart,
  totalCartQty,
  removeCartQty
} from "./../../stores/actions/index";
import { Global, Session } from '../../helpers/Global';
import { Actions } from 'react-native-router-flux';
import { TextField } from 'react-native-material-textfield';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { postFilePublic, postPublic } from '../../providers/Api';
import ActionSheet from "react-native-actionsheet";

var ImagePicker = NativeModules.ImageCropPicker;
class CartEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: new Session(),
      quantity: 1,
      image: null,
      images: [],
      refreshing: true,
      modal: false,
      note: "",
      item: this.props.carts.cart.find(
        x => x.unique_number == this.props.item.unique_number
      ),
      loadingRequest: false
    };
    if (this.state.item.qty > 0) {
      this.state.quantity = this.state.item.qty;
    }

    if (this.state.item.referances) {
      this.state.images = this.state.item.referances;
    }

    if (this.state.item.note) {
      this.state.note = this.state.item.note;
    }
    console.log(this.state.images);
  }

  _onUpdateCart() {
    console.log("Update Cart:+++")
    Keyboard.dismiss();
    this.setState({
      loadingRequest: true
    });

    showMessage({
      message: "Please wait for seconds",
      type: "info"
    });

    if (this.state.images.length <= 0) {
      this.onUpdateSuccess();
      return;
    }

    let uri = "upload-customizes";
    let formdata = new FormData();
    let images = this.state.images;
    for (j = 0; j < images.length; j++) {
      let image = [];
      image["name"] = images[j].name;
      image["type"] = images[j].type;
      image["uri"] = images[j].uri;
      formdata.append("files[]", image);
    }
    console.log(formdata);
    let header = {'Content-Type':'application/json'};
    postPublic(uri, formdata, header)
      .then(response => {
        if (response.status == 200) {
          this.onUpdateSuccess();
        }
        this.setState({
          loadingRequest: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          loadingRequest: false
        });
        showMessage({
          message: "Update Cart Success",
          type: "success"
        });
        Actions.pop({ refresh: { is_refresh: true } });
      });
  }

  onUpdateSuccess() {
    if(this.props.isLoggedIn == true) {
      this.cartGoApi()
    }else {
      this.cartGoSession()
    }
  }

  cartGoSession() {
     // Set Time
    let current_datetime = new Date()
    let StatusHours;

    if(current_datetime.getHours() > 12) {
      StatusHours= "PM"
    }else {
      StatusHours= "AM"
    }

    let setTime = current_datetime.getFullYear()+""+(current_datetime.getMonth().toString().length==1?"0":"")+(current_datetime.getMonth())+(current_datetime.getDate().toString().length==1?"0":"")+(current_datetime.getDate())+(current_datetime.getHours().toString().length<=1?"0":"")+(current_datetime.getHours())+(current_datetime.getMinutes().toString().length<=1?"0":"")+(current_datetime.getMinutes())+(current_datetime.getSeconds().toString().length<=1?"0":"")+(current_datetime.getSeconds())+StatusHours
    console.log(setTime)
    // Set Time End

    setTimeout(() => {
      let item = {
        unique_number: this.state.item.unique_number,
        id: this.state.item.id,
        id_cart: setTime,
        name: this.state.item.name,
        qty: this.state.quantity,
        price: "0",
        image_name: this.state.item.image_name,
        customize_image_name: this.state.item.customize_image_name,
        note: this.state.note,
        is_customize: this.state.item.is_customize,
        referances: this.state.images
      };
      console.log("cart", item);
      this.state.session.cartUpdate(item);
      this.props.onUpdateCart(item);
      this.setState({
        loadingRequest: false
      });

      this.countQty()

      showMessage({
        message: "Update Cart Success",
        type: "success"
      });
      Actions.pop({ refresh: { is_refresh: true } });
    }, 100);
  }

  cartGoApi() {
    console.log("cartGoAPi")

    
    
    // Set Time
    let current_datetime = new Date()
    let StatusHours;

    if(current_datetime.getHours() > 12) {
      StatusHours= "PM"
    }else {
      StatusHours= "AM"
    }

    let setTime = current_datetime.getFullYear()+""+(current_datetime.getMonth().toString().length==1?"0":"")+(current_datetime.getMonth())+(current_datetime.getDate().toString().length==1?"0":"")+(current_datetime.getDate())+(current_datetime.getHours().toString().length<=1?"0":"")+(current_datetime.getHours())+(current_datetime.getMinutes().toString().length<=1?"0":"")+(current_datetime.getMinutes())+(current_datetime.getSeconds().toString().length<=1?"0":"")+(current_datetime.getSeconds())+StatusHours
    console.log(setTime)
    // Set Time End
    const item = {
      unique_number: Global.getUniqueNumber(),
      id: this.state.item.id,
      id_cart: setTime,
      name: this.state.item.name,
      qty: this.state.quantity,
      price: "" + this.state.item.price,
      note: null,
      image_name: this.state.item.image_name,
      customize_image_name: null,
      is_customize: false,
      referances: []
    }

    var uri = "cart"
    var body = {
      email: this.props.user.email,
      cart: [item]
    }

    console.log("Cek Cart Sebelum D lempar ke API")
    console.log(body)

    postPublic(uri, body).then(res => {
      
      if(res.status == 200)
      {
        console.log("Kembalian Api Cart")
        console.log(res)
        console.log(res.data.data)
        console.log(res.data.data.id)
        console.log(this.props.carts.cart)
        if(this.props.carts.cart.length == 0) {
          console.log("if pertama")
          this.state.session.cartAdd(res.data.data);
          this.props.onAddCart(res.data.data);
        }else {
          console.log("if Kedua")
          let i = 0;
          let exist = 0;
          do {
            let cartResponse = this.props.carts.cart[i];
            console.log(cartResponse)
            console.log("cartResponse")
            if(cartResponse.id == res.data.data.id) {
              console.log("id Sama")
              console.log(res.data.data.id)
              console.log(cartResponse.id)
              this.state.session.cartUpdate(res.data.data);
              this.props.onUpdateCart(res.data.data);
              this.countQty()
              exist = 1;
            }
          i++;
          }while(i < this.props.carts.cart.length)

          if(exist == 0) {
            console.log("Cek data Akan Ke simpan Ke Session")
            this.state.session.cartAdd(res.data.data);
            this.props.onAddCart(res.data.data);
          }
        }
        this.countQty()
        showMessage({
          message: 'Product Berhasil Di Update',
          type: 'success',
          duration: 1500
        });
        this.setState({loadingRequest: false});
      } else
      {
        // console.log(res.status)
        showMessage({
          message: res.status,
          type: 'danger',
          duration: 1500
        });
      }
      setTimeout(() => {
        Actions.pop();
      }, 500);
    })
  }

  countQty() {
    this.props.onRemoveQtyCart();
    let countDataQty = 0
    let i = 0

    do {
      console.log("test")
      console.log(this.props.carts.cart.length)
      let cartResponse = this.props.carts.cart[i];
      console.log(cartResponse)
      console.log("jng jng")
      countDataQty += this.props.carts.cart[i].qty
      console.log(countDataQty)
    i++
    } while(i < this.props.carts.cart.length)

    let qtyCart = {
      qtyCart: countDataQty
    }

    this.props.onCountQtyCart(qtyCart);
  }
  // Check Jumlah Qty Cart End

  componentWillMount() {
    this.props.navigation.setParams({ pressSave: this._onUpdateCart });
    console.log(this.props.item.id);
  }

  _getData() {
    session.cartGet().then(result => {
      Actions.refresh({ title: "Cart (" + result.length + ")" });
      this.setState(
        {
          refreshing: false,
          dataSource: result
        },
        function() {}
      );
    });
  }

  renderSourceImage(item) {
    if (item.is_customize == true) {
      return item.customize_image_name;
    }

    if (item.image_name) {
      return {
        uri: Global.getProductImageUrl() + item.image_name
      };
    } else {
      return Global.getBaseUrl() + "assets/images/icon/cart.png";
    }
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  deleteImage(image) {
    let images = this.state.images.filter(
      el => el.increment !== image.increment
    );
    let tempImages = [];
    let no = 0;
    images.map(img => {
      let tempImg = img;
      tempImg["increment"] = no++;
      tempImages.push(tempImg);
    });
    this.setState({
      images: tempImages
    });
    console.log(this.state.images);
    console.log(image);
  }

  pickActionsheet = () => {
    this.ActionSheet.show()
  }

  chooseActionsheet(index) {
    switch (index) {
      case 0: // camera
        this.pickCamera();
        break;
      case 1: // gallery
        this.pickMultiple();
        break;
    }
  }
  pickCamera() {
    this.setState({ modal: false });
    ImagePicker.openCamera({
      waitAnimationEnd: false
    }).then(image => {
      let imagesTemp = this.state.images;
      imagesTemp.push({
        increment: this.state.images.length,
        uri: image.path,
        width: image.width,
        height: image.height,
        type: image.mime,
        name:
          Global.getUniqueNumber() +
          this.state.images.length +
          "." +
          image.mime.toString().replace("image/", ""),
        note: ""
      });
      this.setState({
        image: null,
        images: imagesTemp
      });
    });
  }

  pickMultiple() {
    this.setState({ modal: false });
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 10,
      mediaType: "photo",
      // cropping: true,
      waitAnimationEnd: false,
      includeExif: true,
      includeBase64: true
    })
      .then(images => {
        let imagesTemp = this.state.images;
        // let increment = 0;
        images.map(image => {
          imagesTemp.push({
            increment: this.state.images.length,
            uri: image.path,
            // base64: `data:${image.mime};base64,`+ image.data,
            width: image.width,
            height: image.height,
            type: image.mime,
            name:
              Global.getUniqueNumber() +
              this.state.images.length +
              "." +
              image.mime.toString().replace("image/", ""),
            note: ""
          });
          // increment++;
        });

        this.setState({
          image: null,
          images: imagesTemp
        });
      })
      .catch(e => {}); //alert(e));
  }

  changeImageNote(image, input) {
    let images = JSON.parse(JSON.stringify(this.state.images));
    images[image.increment].note = input;
    this.setState({
      images: images
    });
  }

  renderImage(image) {
    return (
      <View
        style={{
          paddingTop: 16,
          paddingBottom: 10,
          alignItems: "center",
          flexDirection: "row",
          height: 150
        }}
      >
        <View style={{ paddingRight: 15, width: "35%" }}>
          <Icon
            onPress={() => this.deleteImage(image)}
            containerStyle={{
              position: "absolute",
              left: 0,
              padding: 5,
              zIndex: 2,
              backgroundColor: "rgba(52, 52, 52, 0.5)"
            }}
            name="md-trash"
            type="ionicon"
            size={22}
            color="#fff"
          />
          <Image
            style={{
              width: "100%",
              borderRadius: 5,
              height: "100%",
              resizeMode: "cover"
            }}
            source={image}
          />
        </View>
        <View style={{ width: "65%" }}>
          <TextInput
            style={{
              padding: 10,
              height: "100%",
              borderRadius: 5,
              backgroundColor: "#fff",
              borderColor: "#fdeee6",
              borderWidth: 2
            }}
            placeholder="Note"
            multiline={true}
            numberOfLines={4}
            value={image.note}
            onChangeText={input => this.changeImageNote(image, input)}
          />
        </View>
      </View>
    );
  }

  cleanupImages() {
    images.splice();
  }

  renderAsset(image) {
    // if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
    //   return this.renderVideo(image);
    // }

    return this.renderImage(image);
  }

  render() {
    return (
      <KeyboardAwareScrollView>
      <ScrollView keyboardShouldPersistTaps={"always"}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              height: 80,
              padding: 16
            }}
          >
            <Image
              source={this.renderSourceImage(this.props.item)}
              style={{
                width: 60,
                height: 60,
                marginRight: 10,
                borderRadius: 5
              }}
              resizeMode="cover"
            />
            <Text>{this.props.item.name}</Text>
          </View>
          <View style={styles.hairline} />
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <View style={{ width: "50%" }}>
              <Text style={{ color: "#000" }}>Quantity</Text>
            </View>
            <View
              style={{
                width: "50%",
                paddingTop: 5,
                paddingBottom: 5,
                flexDirection: "row"
              }}
            >
              <Button
                title={"-"}
                onPress={() =>
                  this.setState({
                    quantity:
                      this.state.quantity > 1 ? this.state.quantity - 1 : 1
                  })
                }
                buttonStyle={{ borderRadius: 5 }}
              />
              <View
                style={{
                  flex: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0
                }}
              >
                <TextInput
                  value={this.state.quantity.toString()}
                  keyboardType={"number-pad"}
                  style={{ minWidth: 50, textAlign: "center" }}
                  onChangeText={value => this.setState({ quantity: value })}
                />
              </View>
              <Button
                title={"+"}
                onPress={() =>
                  this.setState({ quantity: this.state.quantity + 1 })
                }
                buttonStyle={{ borderRadius: 5 }}
              />
            </View>
          </View>
          <View style={styles.hairline} />
          <View style={{ padding: 10 }}>
            <TextField
              ref={this.lastnameRef}
              value={this.state.note}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              // onFocus={this.onFocus}
              onChangeText={value => this.setState({ note: value })}
              // onSubmitEditing={this.onSubmitLastname}
              returnKeyType="next"
              label="Product Descriptions"
              // error={errors.lastname}
              tintColor={"#000"}
              lineWidth={1}
              multiline={true}
              height={50}
            />
            {/* <Text style={{}}>Notes</Text>
            <TextInput style={{ marginTop: 5, height: 100, borderRadius: 5, padding: 8, backgroundColor:'#fff', borderColor: '#fdeee6', borderWidth: 2}} 
                placeholder='Input text here'
                multiline = {true}
                numberOfLines = {5}
                value={this.state.note}
                onChangeText={(value) => this.setState({note: value})}
            />  */}
          </View>
          <View style={styles.hairline} />

          <View style={{ padding: 10 }}>
            <Text style={{}}>Your Design</Text>

            {this.state.image ? this.renderAsset(this.state.image) : null}
            {this.state.images
              ? this.state.images.map(i => (
                  <View key={i.uri}>{this.renderImage(i)}</View>
                ))
              : null}
            <Button
              TouchableOpacity
              onPress={this.pickActionsheet}
              buttonStyle={{
                marginTop: 20,
                backgroundColor: "#6bc3cd",
                borderRadius: 5,
                width: "100%"
              }}
              title="Upload Your Design"
              containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            />
            <Button
              TouchableOpacity
              loading={this.state.loadingRequest}
              onPress={() => this._onUpdateCart()}
              buttonStyle={{
                marginTop: 20,
                backgroundColor: "#6bc3cd",
                borderRadius: 5,
                width: "100%"
              }}
              title={this.state.loadingRequest ? " " : "Save"}
              containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            />
          </View>

          <ActionSheet
            ref={o => this.ActionSheet = o}
            title={'Upload your design with?'}
            options={[
              'Camera',
              'Gallery',
              'Cancel'
            ]}
            cancelButtonIndex={2}
            onPress={(index) => { this.chooseActionsheet(index) }}
          />
        </View>
      </ScrollView>
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
  floatingButtonStyle: {
    // resizeMode: 'cover',
    width: 35,
    height: 35,
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
    carts: state.carts,
    qtyCart: state.qtyCart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateCart: cart => dispatch(updateCart(cart)),
    onCountQtyCart: (qtyCart) => dispatch(totalCartQty(qtyCart)),
    onRemoveQtyCart: ()=> dispatch(removeCartQty())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartEdit);