import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  TextInput
} from 'react-native';
import {
  addCart
} from './../stores/actions/index';
import { Text, Button } from 'react-native-elements';
import { Global, Session, currencyIndonesianFormat } from '../helpers/Global';
import { Actions } from 'react-native-router-flux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import HTML from 'react-native-render-html';
import RelatedItemCard from '../components/RelatedItemCard';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { getPublic } from '../providers/Api';

class ProductDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
      images: [],
      session: new Session(),
      quantity: 1,
      item: this.props.item,
      productTags: [],
      activeSlide: 0,
      loadingRequest: false
    };

    this.state.item.product_attributes = [];
    console.log(this.props.carts);
  }

  _productImage(image) {
    return Global.getProductImageUrl() + 'thumb_' + image;
  }

  componentWillMount(){
    this._getData();
  }

  _getData() {
    const uri = 'product/' + this.props.item.id;
    return getPublic(uri).then(response => {
      this.setState({
        refreshing: false,
        item: response.data.data,
        productTags: response.data.related_products
      });
    });
  }

  _onPressProductDetail(item) {
    Actions.pop();
    Actions.productDetail({item: item, title: item.name});
  }

  _requestQuote() {
    this.setState({loadingRequest: true});
    setTimeout(() => {
      const item = {
        unique_number: Global.getUniqueNumber(),
        id: this.state.item.id,
        name: this.state.item.name,
        qty: this.state.quantity,
        price: "" + this.state.item.price,
        note: null,
        image_name: this.state.item.image_name,
        customize_image_name: null,
        is_customize: false,
        referances: []
      }
      this.state.session.cartAdd(item);
      this.props.onAddCart(item);
      console.log(this.props.carts);
      showMessage({
        message: 'The product was successfully inserted to shopping cart',
        type: 'success',
        duration: 1500
      });
      this.setState({loadingRequest: false});
      setTimeout(() => {
        Actions.pop();
      }, 500);
    }, 100);
  }

  openGallery(position) {
    let images = [];
    images.push({
      source: {uri: this._productImage(this.state.item.image_name)}
    });
    this.state.item.product_attributes.map(attribute => {
      if (attribute.product_images != null) {
        attribute.product_images.map(image => {
          images.push({
            source: {uri: this._productImage(image.image_name)}
          });
        });
      }
    });
    console.log(images);
    Actions.imageGallery({images: images, position: position});
  }

  renderImages() {
    let images = [];
    images.push(
      <TouchableWithoutFeedback
        key={'main'}
        onPress={() => this.openGallery(0)}
      >
        <Image
          key={this.state.item.image_name}
          source={{uri: this._productImage(this.state.item.image_name)}}
          style={styles.slideImageStyle}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    );
    let i = 0;
    this.state.item.product_attributes.map(attribute => {
      if (attribute.product_images != null) {
        console.log(attribute.product_images);
        attribute.product_images.map(image => {
          images.push(
            <TouchableWithoutFeedback
              key={i}
              onPress={() => this.openGallery(i)}
            >
              <Image
                key={image.image_name}
                source={{uri: this._productImage(image.image_name)}}
                style={styles.slideImageStyle}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          );
          i++;
        });
      }
    });
    return images;
  }

  render() {
    console.log(this.state.dataSource);
    let relatedProducts = null;
    if (this.state.productTags.length > 0) {
      relatedProducts = (
        <Text style={{
          paddingLeft: 16,
          paddingBottom: 10,
          fontSize: 18
        }}>
          Related Products
        </Text>
      );
    }
    
    return(
      <View style={styles.container}>
        <ScrollView>
          <Carousel
            ref={(carousel) => { this._carousel = carousel; }}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            enableSnap={true}
          >
            {this.renderImages()}
          </Carousel>
          <Pagination
            dotsLength={this.state.images.length}
            activeDotIndex={this.state.activeSlide}
            containerStyle={styles.paginationContainerStyle}
            dotStyle={styles.paginationDotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <View style={styles.innerContainer}>
            <Text style={styles.itemNameStyle}>{this.state.item.name}</Text>
            <HTML
              html={this.state.item.description}
            />
            {/* <Text style={styles.priceRangeStyle}>Price Range</Text>
            <Text style={[styles.priceRangeStyle, {color: '#555'}]}>Rp {Global.getFormattedCurrency(parseFloat(this.state.item.price))} - Rp {Global.getFormattedCurrency(parseFloat(this.state.item.price_max))}</Text> */}
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: '60%', padding: 16}}>
                <Text style={{fontSize: 14, color: '#000'}}>Quantity</Text>
              </View>
              <View style={{width: '40%', paddingTop: 5, paddingBottom: 5, flexDirection: 'row'}}>
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
            
          <View style={[styles.container, {marginTop: 10}]}>
            {relatedProducts}
            <FlatList
              data={this.state.productTags}
              style={{flex: 1, paddingBottom: 10, paddingLeft: 2, paddingRight: 2}}
              // containerStyle={{ margin: 0, padding: 16}}
              horizontal={true}
              automaticallyAdjustContentInsets={true}
              renderItem={({item}) => <RelatedItemCard item={item} />}
            />
          </View>
        </ScrollView>
        <Button
          full
          loading={this.state.loadingRequest}
          buttonStyle={{backgroundColor: "#ff4545"}}
          containerViewStyle={{marginLeft:-0,width:"100%"}}
          onPress={() => this._requestQuote()}
          title={this.state.loadingRequest == true ? ' ' : 'REQUEST A QUOTE'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0
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
  cardImageStyle: {
    height: 180,
  },
  cardStyle: {
    margin: 10
  },
  slideImageStyle: {
    width: Dimensions.get('window').width, 
    height: 350
  },
  paginationContainerStyle: {
    backgroundColor: 'transparent',
    paddingTop: 0, 
    paddingBottom: 0, 
    marginTop: -15
  },
  paginationDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.92)'
  },
  itemNameStyle: {
    fontSize: 18, 
    color: '#000'
  },
  priceRangeStyle: {
    fontSize: 14, 
    color: '#000', 
    marginTop: 6
  },
  quantityFormContainerStyle: {
    flex: 1, 
    flexDirection: 'row'
  }
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    carts: state.carts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddCart: cart => dispatch(addCart(cart))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);