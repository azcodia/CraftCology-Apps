import React, { Component } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  TouchableNativeFeedback, 
  Platform, 
  Dimensions
} from 'react-native';
import { Card, Text } from 'react-native-elements';
import { Global, Session } from '../helpers/Global';
import { Actions } from 'react-native-router-flux';

export default class ItemCard extends Component {

  constructor(props){
    super(props);
    this.state = { 
      refreshing: true, 
      isLoggedIn: null, 
      session: new Session(),
      item: this.props.item
    };
  }

  getProductImage() {

    if(this.props.kategory === "Product") {
      image = 'thumb_'+this.state.item.image_name
    }else if(this.props.kategory === "Materials") {
      image = this.state.item.image
    }else {
      image = 'thumb_'+this.state.item.image_name
    }
    return Global.getBaseUrl() + 'backend/uploads/'+image;
  }

  onPressProductDetail() {
    this.setState({
      is_refresh_cart_badge: true
    });
    Actions.productDetail({
      item: this.state.item, 
      short_name: this.state.item.name
    });
  }

  onPressMaterialDetail(name, short_name, image, description) {
    Actions.materialDetailsPages({
      name: name,
      short_name: short_name,
      image: image,
      description: description,
    })
  }

  render() {
    let item = this.state.item;

    if (Platform.OS == 'android') {
      return (
          <TouchableNativeFeedback
            // onPress={() => this.onPressProductDetail()}>
            onPress={() => this.props.kategory == "Product" ? this.onPressProductDetail() : this.onPressMaterialDetail(item.name, item.short_name, item.image, item.description)}>
            <Card
              containerStyle={{width: '50%', padding: 0, marginRight: 0, marginLeft: 0, marginTop: 0, marginBottom: 0}}
              image={{uri: this.getProductImage()}}
              imageStyle={styles.cardImageStyle}>
              <Text style={styles.cardTitleTextStyle} numberOfLines={1}>
                {this.props.kategory == "Product" ? item.name : item.short_name}
              </Text>
              <Text numberOfLines={2}>
                {/* {item.category ? item.category.name : '-'} */}
                {this.props.kategory == "Product" ? item.category.name : item.name}
              </Text>
            </Card>
          </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.kategory == "Product" ? this.onPressProductDetail() : this.onPressMaterialDetail()}
        style={{ flex: 1 }}>
        <Card style={styles.cardStyle}
          containerStyle={{ padding: 0, margin: 0}}
          image={{uri: this.getProductImage()}}
          imageStyle={styles.cardImageStyle}>
          <Text style={styles.cardTitleTextStyle} numberOfLines={1}>
            {/* {item.name} */}
            {this.props.kategory == "Product" ? item.name : item.short_name}
          </Text>
          <Text numberOfLines={2}>
            {/* {item.category ? item.category.name : '-'} */}
            {this.props.kategory == "Product" ? item.category.name : item.name}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardImageStyle: {
    height: 180,
  },
  cardTitleTextStyle: {
    width: '100%',
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
  }
});