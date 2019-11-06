import React, { Component } from 'react';
import { 
  FlatList, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  RefreshControl, 
  NetInfo,
  Image,
  ActivityIndicator,
  Text,
  ScrollView
} from 'react-native';
import { 
  Icon, 
  Badge 
} from 'react-native-elements';
import { 
  Session,
  Global
} from '../../helpers/Global';
import { Actions } from 'react-native-router-flux';
import TabIcon from '../../components/TabIcon';
import DataNotFound from '../../components/DataNotFound';
import ItemCard from '../../components/ItemCard';
import OfflineNotice from '../../components/OfflineNotice';
import { getPublic } from '../../providers/Api';
import { connect } from 'react-redux';

class MaterialDetailsPages extends Component {

  static navigationOptions = {
    title: 'Materials Detail'
  };

  constructor(props) {
    super(props)
    this.state = {
      refreshing: true, 
      isLoggedIn: null, 
      session: new Session(), 
      isConnected: true
    }
  }

  componentDidMount() {
      console.log("Material Details Pages")
      console.log(this.props.name)
      console.log(this.props.short_name)
      console.log(this.props.image)
      console.log(this.props.description)
  }

  getProductImage() {
      return Global.getBaseUrl()+'backend/uploads/'+this.props.image
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.imageBox}>
            <Image
                source={{uri: this.getProductImage()}}
                style={[styles.imageStyle]}
            />
            <View style={[ styles.shortName ]}>
                <Text style={ [ styles.shortNameText ] }>{this.props.short_name}</Text>
            </View>
            <View style={[ styles.Name ]}>
                <Text style={ [ styles.NameText ] }>{this.props.name}</Text>
            </View>
        </View>
        <View style={ [ styles.description ] }>
            <Text style={ [ styles.descriptionHeadTitle ] }>Description</Text>
            <ScrollView
                
            >
                <Text style={ [ styles.descriptionTitle ] }>
                    {this.props.description}
                </Text>
            </ScrollView>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff'
  },
  flatListContentContainerStyle: {
    padding: 0,
    margin: 0,
    width: '100%'
  },
  imageBox: {
      width: '100%',
      height: 250,
    //   backgroundColor: 'red'
  },
  imageStyle: {
    width: '100%',
    height: 250,
      resizeMode: 'cover'
  },
  shortName: {
      position: 'absolute',
      left: 10,
      bottom: 40
  },
  shortNameText: {
      fontSize: 24,
      color: 'white',
      fontWeight: '900'
  },
  Name: {
    position: 'absolute',
    left: 10,
    bottom: 25
  },
  NameText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '400'
  },
  description: {
      padding: 12
  },
  descriptionHeadTitle: {
      paddingBottom: 8,
      fontSize: 20,
      color: 'black',
      fontWeight: '400'
  },
  descriptionTitle: {
    paddingTop: 8,
    fontSize: 12,
    color: 'black',
    fontWeight: '200'
  }

});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    carts: state.carts.cart
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaterialDetailsPages);