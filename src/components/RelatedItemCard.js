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

export default class RelatedItemCard extends Component {

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
    return Global.getBaseUrl() + 'backend/uploads/' + this.state.item.image_name;
  }

  onPressProductDetail() {
    Actions.pop();
    Actions.productDetail({
      item: this.state.item, 
      title: this.state.item.name
    });
  }

  render() {
    let item = this.state.item;

    if (Platform.OS == 'android') {
      return (
          <TouchableNativeFeedback onPress={() => this.onPressProductDetail()}>
            <Card
              containerStyle={{width: 180, padding: 0, marginRight: 0, marginLeft: 0, marginTop: 0, marginBottom: 0}}
              image={{uri: this.getProductImage()}}
              imageStyle={styles.cardImageStyle}>
              <Text style={styles.cardTitleTextStyle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text numberOfLines={2}>
                {item.category.name}
              </Text>
            </Card>
          </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity onPress={() => this.onPressProductDetail()} style={{ flex: 1 }}>
        <Card style={styles.cardStyle}
          containerStyle={{padding: 0, margin: 0}}
          image={{uri: this.getProductImage()}}
          imageStyle={styles.cardImageStyle}>
          <Text style={styles.cardTitleTextStyle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text numberOfLines={2}>
            {item.category.name}
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