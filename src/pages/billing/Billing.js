import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  WebView,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import { Global, Session } from '../../helpers/Global';
import { ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Swipeout from 'react-native-swipeout';
import DataNotFound from '../../components/DataNotFound';
import { getPublic, requestPublic } from '../../providers/Api';
import { connect } from 'react-redux';
import {
  unsetUser
} from "./../../stores/actions/index";
import { showMessage } from 'react-native-flash-message';

class Billing extends Component {

  static navigationOptions = {
    title: 'Billing Information'
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
    console.log("cek token biling: ");
    console.log(this.props.user.token);
    this.getData();
  }

  componentDidUpdate() {
    this.getData();
  }  

  getData() {
    let uri = 'customer-billing';
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
    };

    getPublic(uri, headers).then(response => {
      if (response.status == 401) {
        showMessage({
          message: response.data.message,
          type: 'danger'
        });
        this.props.onUnsetUser();
        Actions.login();
        return;
      }
      this.setState({
        refreshing: false,
        models: response.data.data,
      });
      console.log(response);
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
    let uri = 'customer-billing/' + item.id;
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.user.token
    };
    requestPublic('DELETE', uri, null, headers).then(response => {
      this.setState({
        refreshing: false
      });
      if (response.status == 401) {
        showMessage({
          message: response.data.message,
          type: 'danger'
        });
        this.props.onUnsetUser();
        Actions.login();
        return;
      }
      if (response.status == 200 || response.status == 201) {
        showMessage({
          message: response.data.message,
          type: 'success'
        });
        this.setState({
          models: response.data.data
        });
      }
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
            'Delete ' + item.billing_account,
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
          title={item.billing_account}
          subtitle={item.billing_name}
          rightTitle={item.billing_code}
          onPress={() => Actions.billingInfoForm({
            user: this.props.user, 
            title: 'Update Billing #' + item.billing_account,
            item: item
          })}
        />
      </Swipeout>
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.models) {
      this.setState({
        models: nextProps.models
      });
    }
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
            title={"Create New Billing"}
            // subtitle={item.billing_code}
            rightIcon={{name: 'add-to-list', type: 'entypo'}}
            onPress={() => Actions.billingInfoForm({user: this.props.user, title: 'Create New Billing', item: null})}
          />
        <FlatList
          data={this.state.models}
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
    isLoggedIn: state.user.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUnsetUser: () => dispatch(unsetUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Billing);