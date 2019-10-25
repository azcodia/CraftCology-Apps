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
import { getPublic } from '../../providers/Api';
import {
  setListOrder,
  selectOrder,
  unsetUser
} from "../../stores/actions/index";

class ListConfirmPayment extends Component {

  static navigationOptions = {
    title: 'Confirm Payment'
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

    let url = 'order/must-payment';
    
    let headers = {
      headers:{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
      },
      data: {},
    };
    getPublic(url, headers).then(response => {
      console.log(response);
      this.setState({refreshing:false});
      if (response.status == 200) {
        this.props.onSetListOrder(response.data.data);
        return;
      }
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

  getTotal(item) {
    if (item.status == 'INVOICE_1') {
      return item.amount_1;
    } else if (item.status == 'INVOICE_2') {
      return item.amount_2;
    }

    return item.shopping_total;
  }

  renderOrderItem(item) {
    return (
      <ListItem
        key={item.id}
        title={item.code_order}
        subtitle={"Rp " + Global.getFormattedCurrency(this.getTotal(item))}
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

export default connect(mapStateToProps, mapDispatchToProps)(ListConfirmPayment);