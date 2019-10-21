import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  WebView,
  FlatList,
  Alert,
  Text,
  RefreshControl
} from 'react-native';
import { Global, Session } from '../../helpers/Global';
import { ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Swipeout from 'react-native-swipeout';
import DataNotFound from '../../components/DataNotFound';
import { connect } from 'react-redux';
import { 
  setListUserAddress, unsetUser 
} from '../../stores/actions/index';
import { getPublic } from '../../providers/Api';

class ShippingAddress extends Component {

  static navigationOptions = {
    title: 'Shipping Address'
  }

  constructor(props){
    super(props);

    this.state = {
      models: [],
      refreshing: true,
      session: new Session(),
    };
  }

  componentDidMount() {
    console.log("Props: "+this.props.isFromOrderForm)
    this.getData();
  }

  getData() {
    console.log(this.props.user);
    let uri = 'customer-address';
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
    };
    getPublic(uri, headers).then(response => {
      this.setState({
        refreshing: false,
        models: response.data.data,
      });
      this.props.onSetListUserAddress(response.data.data);
      console.log(response);
    }).catch(error => {
      this.props.onUnsetUser();
      this.setState({
        refreshing: false,
      });
      Actions.login();
    });
  }

  onRefreshFlatList() {
    this.setState({refreshing: true});
    this.getData();
  }

  onDelete(item) {
    this.setState({
      refreshing: true
    });
    return fetch(Global.getBaseUrl() + 'api/v1/customer-address/' + item.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.token
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        refreshing: false
      });
      if (responseJson.status == 200 || responseJson.status == 201) {
        Global.presentToast(responseJson.message);
        this.props.onSetListUserAddress(responseJson.data);
        this.setState({
          models: responseJson.data
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderFlatListItem(item) {
    var swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor: '#ff4545',
        color: '#fff',
        onPress: () => {
          Alert.alert(
            'Delete ' + item.address_name,
            'Are you sure to delete this item?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.onDelete(item)},
            ],
            //{ cancelable: false }
          )
        }
      }
    ];
    return (
      <Swipeout autoClose={true} right={swipeoutBtns} style={{ backgroundColor: 'transparent' }}>
        <ListItem
          title={item.address_name}
          subtitle={item.address}
          onPress={() => Actions.shippingAddressForm({
            user: this.props.user, 
            title: 'Update Address #' + item.address_name,
            item: item,
            isFromOrderForm: false,

          })}
        />
      </Swipeout>
    );
  }

  renderDataEmpty() {
    if (this.state.refreshing == false) {
      return <DataNotFound containerStyle={{ marginTop: 20 }}/>;
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <ListItem
            title={"Create New Address"}
            // subtitle={item.billing_code}
            rightIcon={{name: 'add-to-list', type: 'entypo'}}
            onPress={() => Actions.shippingAddressForm({user: this.props.user, title: 'Create New Address', item: null, isFromOrderForm: false, })}
          />
        <FlatList
          data={this.props.listUserAddresses}
          containerStyle={{ width: '100%' , margin: 0, padding: 0}}
          refreshControl={
            <RefreshControl 
              refreshing={this.state.refreshing}
              onRefresh={this.onRefreshFlatList.bind(this)} />
          }
          ListEmptyComponent={this.renderDataEmpty()}
          renderItem={({item}) => this.renderFlatListItem(item)} />
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff'
  }
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    listUserAddresses: state.userAddresses.addresses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetListUserAddress: (listUserAddresses) => dispatch(setListUserAddress(listUserAddresses)),
    onUnsetUser: () => dispatch(unsetUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress);