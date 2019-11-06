import React, { Component } from 'react';
import { 
  FlatList, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  RefreshControl, 
  NetInfo,
  Image,
  ActivityIndicator
} from 'react-native';
import { 
  Icon, 
  Badge 
} from 'react-native-elements';
import { 
  Session 
} from '../../helpers/Global';
import { Actions } from 'react-native-router-flux';
import TabIcon from '../../components/TabIcon';
import DataNotFound from '../../components/DataNotFound';
import ItemCard from '../../components/ItemCard';
import OfflineNotice from '../../components/OfflineNotice';
import { getPublic } from '../../providers/Api';
import { connect } from 'react-redux';

class SpesialOfferPages extends Component {

  static navigationOptions = {
    title: 'Spesial Offers'
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

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  async componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    return this._getData();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  _getData() {
    var uri = 'product/shop-special';

    getPublic(uri)
    .then(response => {
      this.setState({
        refreshing: false
      });
      if (response.status == 200) {
        console.log("cek API Di Page Materials")
        console.log(response)
        this.setState({
          dataSource: response.data.data,
        });
      }
    }).catch(err => {
      this.setState({
        refreshing: false
      });
    });
  }

  displayNoInternetAccess() {
    if (!this.state.isConnected) {
      return (
        <OfflineNotice />
      );
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getData();
  }

  renderDataEmpty() {
    if (this.state.refreshing == false) {
      return <DataNotFound containerStyle={{ marginTop: 20 }}/>;
    } else {
      return <ActivityIndicator size={"large"} style={{ marginTop: 25 }} />
    }
  }

  render() {
    return(
      <View style={styles.container}>
        {this.displayNoInternetAccess()}
        <FlatList
          data={this.state.dataSource}
          // contentContainerStyle={styles.flatListContentContainerStyle}
          containerStyle={{ width: '100%' , margin: 0, padding: 0}}
          // flexWrap='wrap'
          horizontal={false}
          numColumns='2'
          refreshControl={
            <RefreshControl 
              refreshing={this.state.refreshing}
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}/>
          }
          renderItem={({item}) => <ItemCard item={item} kategory="Product" />}
          ListEmptyComponent={this.renderDataEmpty()}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(SpesialOfferPages);