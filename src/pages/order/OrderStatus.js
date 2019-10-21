import React, { Component } from 'react';
import { 
  View,
  FlatList,
  RefreshControl,
  Text
} from 'react-native';
import { Global, Session } from '../../helpers/Global';
import { ListItem } from 'react-native-elements';
import { Actions, ActionConst } from 'react-native-router-flux';
import moment from "moment";
import DataNotFound from '../../components/DataNotFound';
import { connect } from 'react-redux';
import { getPublic } from './../../providers/Api';
import {
  setListOrder,
  selectOrder,
  unsetUser
} from "./../../stores/actions/index";
import { showMessage } from 'react-native-flash-message';

class OrderStatus extends Component {

  static navigationOptions = {
    title: 'Order Status'
  };

  constructor(props){
    super(props);

    this.state = {
      refreshing: true,
      models: [],
      session: new Session()
    };
  }

  componentWillMount() {
    this.getModels();
    console.log(moment().endOf('day').fromNow());
  }

  componentWillReceiveProps(prop) {
    console.log(prop);
  }

  getModels() {
    let uri = 'customer/track-your-order';
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
    };
    getPublic(uri, headers).then(response => {
      this.setState({refreshing:false});
      if (response.status == 200) {
        console.log("check List Order Url Api: ");
        console.log()
        console.log("Cek List Order: ");
        console.log(response.data.data);
        this.props.onSetListOrder(response.data.data);
        return;
      }
      console.log("Cek List Order: "+response);
      showMessage({
        message: response.data.message,
        type: 'danger'
      });
      if (response.status == 401) {
        this.props.onUnsetUser();
        Actions.login();
        return;
      }
    }).catch(error => {
      this.props.onUnsetUser();
      this.setState({
        refreshing: false,
      });
      Actions.login();
    });
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.getModels();
  }

  onPressOrderDetail(item) {
    this.props.onSelectOrder(item);
    Actions.orderStatusDetail({
      user: this.props.user,
      title: item.code_order,
      item: item
    });
  }

  renderOrderItem(item) {
    return (
      <ListItem
        key={item.id}
        title={item.code_order}
        subtitle={item.status_label}
        rightTitle={moment(item.created_at).format('DD MMM YYYY')}
        onPress={() => this.onPressOrderDetail(item)}
      />
    );
  }

  renderDataEmpty() {
    if (this.state.refreshing == false) {
      return <DataNotFound containerStyle={{ marginTop: 20 }}/>;
    }
  }

  render() {
    return(
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={this.props.orders}
          containerStyle={{ width: '100%' , margin: 0, padding: 0}}
          refreshControl={
            <RefreshControl 
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}/>
          }
          renderItem={({item}) => this.renderOrderItem(item)}
          ListEmptyComponent={this.renderDataEmpty()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    orders: state.orders.orders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetListOrder: (orders) => dispatch(setListOrder(orders)),
    onSelectOrder: (order) => dispatch(selectOrder(order)),
    onUnsetUser: () => dispatch(unsetUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus);