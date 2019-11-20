import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  NativeModules,
  PixelRatio,
  Image,
  Keyboard
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {  Text, Button, Icon } from 'react-native-elements';
import { Global, Session } from '../helpers/Global';
import { Actions } from 'react-native-router-flux';
import { TextField } from 'react-native-material-textfield';
import {
  addCart,
  totalCartQty,
  removeCartQty
} from "./../stores/actions/index";
// var ImagePicker = NativeModules.ImageCropPicker;
import ImagePicker from 'react-native-image-crop-picker';
//import ImagePicker from "react-native-customized-image-picker";
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { postFilePublic, postPublic } from '../providers/Api';
import Permissions from 'react-native-permissions';
import ActionSheet from "react-native-actionsheet";

class Customize extends Component {

  constructor(props){
    super(props);
    this.state = {
      session: new Session(),
      quantity: 1,
      activeSlide: 0,
      avatarSource: null,
      videoSource: null,
      image: null,
      images: [],
      productname: '',
      note: '',
      id: '',
      modal: false,
      loadingRequest: false,
      listForms: [
        'productname',
        'note',
      ]
    };

    this.onFocus = this.onFocus.bind(this);
    this.onRequestQuote = this.onRequestQuote.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitNote = this.onSubmitNote.bind(this);
    this.onSubmitProductname = this.onSubmitProductname.bind(this);

    this.productnameRef = this.updateRef.bind(this, 'productname');
    this.noteRef = this.updateRef.bind(this, 'note');
  }

  onRequestQuote() {
    let errors = {};

    Keyboard.dismiss();

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

    if (this.state.images.length <= 0) {
      Global.presentToast("Image is required");
      return;
    }

    this.setState({
      loadingRequest: true
    });

    showMessage({
      message: 'Please wait for seconds',
      type: 'info'
    });

    let uri = 'upload-customizes';
    let formdata = new FormData();
    let images = this.state.images;
    for (j=0;j<images.length;j++) {
      let image = [];
      image['name'] = images[j].name;
      image['type'] = images[j].type;
      image['uri'] = images[j].uri;
      formdata.append("files[]", image);
    }
    console.log(formdata, "formdata");

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

    let header = {'Content-Type':'application/json'};
    postPublic(uri, formdata, header).then(response => {
      console.log(response, "Customu");
      if (response.status == 200) {
        setTimeout(() => {
          const item = {
            unique_number: Global.getUniqueNumber(),
            id: this.state.id,
            id_cart: setTime,
            name: this.state.productname,
            qty: this.state.quantity,
            price: "0",
            image_name: null,
            customize_image_name: this.state.images.length > 0 ? this.state.images[0] : null,
            note: this.state.note,
            is_customize: true,
            referances: this.state.images.length > 0 ? this.state.images : []
          }
          
          this.state.session.cartAdd(item);
          this.props.onAddCart(item);

          this.countQty();

          showMessage({
            message: 'Your Customize Product was successfully inserted to shopping cart',
            type: 'success'
          });
          this.setState({
            loadingRequest: false,
            quantity: 1,
            activeSlide: 0,
            avatarSource: null,
            videoSource: null,
            image: null,
            images: [],
            productname: '',
            note: '',
            id: '',
          });
          showMessage({
            message: 'Your Customize Product was successfully inserted to shopping cart',
            type: 'success'
          });
          this.setState({
            loadingRequest: false
          });
          return;
        }, 100);
      }
    });
  }

  // Kalkulasi QTY Cart
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
      countDataQty += new Number(this.props.carts.cart[i].qty)
      console.log(countDataQty)
    i++
    } while(i < this.props.carts.cart.length)

    let qtyCart = {
      qtyCart: countDataQty
    }

    this.props.onCountQtyCart(qtyCart);
  }
  // Kalkulasi QTY Cart End

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

  onChange(value) {
    console.log(value);
    console.log(this.state.listForms);
  }

  onSubmitProductname() {
    this.productname.focus();
  }

  onSubmitNote() {
    this.note.focus();
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount(){
    this.state.id = Global.getUniqueNumber();
  }
  
  deleteImage(image) {
    let images = this.state.images.filter(el => el.increment !== image.increment);
    let tempImages = [];
    let no = 0;
    images.map(img => {
      let tempImg = img;
      tempImg['increment'] = no++;
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
    this.setState({modal: false});
    ImagePicker.openCamera({
      waitAnimationEnd: false
    }).then(image => {
      let imagesTemp = this.state.images;
      imagesTemp.push(
        {
          increment: this.state.images.length, 
          uri: image.path, 
          width: image.width, 
          height: image.height, 
          type: image.mime,
          name: Global.getUniqueNumber() + this.state.images.length + '.' + (image.mime.toString()).replace('image/', ''),
          note: ''
        }
      );
      this.setState({
        image: null,
        images: imagesTemp
      });
    });
  }

  pickMultiple() {
    this.setState({modal: false});
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 5,
      mediaType: "photo",
      // cropping: true,
      //waitAnimationEnd: false,
      includeExif: true,
      includeBase64: true
    }).then(images => {
      let imagesTemp = this.state.images;
      images.map(image => {
        imagesTemp.push(
          {
            increment: this.state.images.length, 
            uri: image.path, 
            width: image.width, 
            height: image.height, 
            type: image.mime,
            name: Global.getUniqueNumber() + this.state.images.length + '.' + (image.mime.toString()).replace('image/', ''),
            note: ''
          }
        );
      });
      console.log(this.state.images);
      this.setState({
        image: null,
        images: imagesTemp
      });
      console.log('after');
      console.log(this.state.images);
    }).catch(e => {})//alert(e));
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
      <View style={{paddingTop:16, paddingBottom:10, flex: 1, alignItems: 'center', flexDirection: 'row', height:150}}>
        <View style={{ paddingRight:15, width:'35%' ,}}>
          <Icon
            onPress={() => this.deleteImage(image)} 
            containerStyle={{position: 'absolute', left: 0, padding: 5, zIndex: 2, backgroundColor: 'rgba(52, 52, 52, 0.5)', borderRadius: 2 }}
            name='md-trash'
            type='ionicon'
            size={22}
            color='#fff' />
          <Image style={{ width:'100%' , borderRadius: 5, height: '100%', resizeMode: 'cover'}} source={image} />
        </View>
        <View style={{width:'65%'}}>
          <TextInput style={{ padding: 10, height: '100%', borderRadius: 5, backgroundColor:'#fff', borderColor: '#888', borderWidth: 1 }} 
            placeholder='Note'
            multiline = {true}
            numberOfLines = {4}
            value={image.note}
            onChangeText={input => this.changeImageNote(image, input)}
          />  
        </View>
      </View>
      )
  }

  render() {
    let { errors = {}, ...data } = this.state;
    return(
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
        <ScrollView style={{ padding: 16, paddingBottom: 0 }} keyboardShouldPersistTaps={"always"} keyboardDismissMode='on-drag'>
          <View>
            <Text>Customize your items</Text>
            <TextField
              ref={this.productnameRef}
              value={this.state.productname}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              // onChangeText={input => this.setState({productname: input})}
              onSubmitEditing={this.onSubmitProductname}
              returnKeyType='next'
              label='Product Name'
              error={errors.productname}
              tintColor={'#000'}
              lineWidth={1}
            />
            <TextField
              ref={this.noteRef}
              value={this.state.note}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              // onChangeText={(value) => this.setState({note: value})}
              onSubmitEditing={this.onSubmitNote}
              returnKeyType='next'
              label='Product Descriptions'
              error={errors.note}
              tintColor={'#000'}
              lineWidth={1}
              multiline={true}
              height={50}
            />
          <View>       
          <View style={{flex: 1, flexDirection: 'row', marginTop:10, alignContent: 'center', alignItems:'center'}}>
            <View style={{width: '50%'}}>
              <Text style={{color: '#000'}}>Quantity</Text>
            </View>
            <View style={{width: '50%', paddingTop: 5, paddingBottom: 5, flexDirection: 'row'}}>
              <Button title={"-"} onPress={() => this.setState({quantity: parseInt(this.state.quantity) > 1 ? parseInt(this.state.quantity)-1 : 1})} buttonStyle={{ borderRadius: 5 }} />
                <View style={{flex: 4, justifyContent: 'center', alignItems: 'center',  padding: 0}}>
                  <TextInput 
                    value={this.state.quantity.toString()} 
                    keyboardType={"number-pad"}
                    style={{minWidth:50,textAlign:"center"}}
                    onChangeText={ value => this.setState({quantity:value}) }
                    />
                </View>
              <Button title={"+"} onPress={() => this.setState({quantity: parseInt(this.state.quantity)+1})} buttonStyle={{ borderRadius: 5 }} />
            </View>
          </View>
          </View>

          </View>
          <Text style={{paddingTop:20}}>Your Design</Text>
          <View >
            {this.state.image ? this.renderImage(this.state.image) : null}
            {this.state.images ? this.state.images.map(i => 
              <View key={i.increment}>{this.renderImage(i)}</View>
            ) : null}
            </View>
            <Button 
                TouchableOpacity 
                onPress={this.pickActionsheet}
                buttonStyle={{ marginTop: 20, backgroundColor: '#6bc3cd', borderRadius: 5, width: "100%"}} 
                title='Upload Your Design'
                containerViewStyle={{marginLeft: 0, marginRight: 0}}
            />
            <Button 
              full
              loading={this.state.loadingRequest}
              buttonStyle={{backgroundColor: "#ff4545", borderRadius: 5 }}
              containerViewStyle={{marginLeft:-0,width:"100%", marginTop: 10, marginBottom: 30 }}
              title={this.state.loadingRequest == true ? ' ' : 'REQUEST A QUOTE'}
              onPress={() => this.onRequestQuote()} />

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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 10,
    width: 100,
    height: 100
  }

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
    onAddCart: cart => dispatch(addCart(cart)),
    onCountQtyCart: (qtyCart) => dispatch(totalCartQty(qtyCart)),
    onRemoveQtyCart: ()=> dispatch(removeCartQty())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customize);