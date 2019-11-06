import React, { Component } from 'react';
import { 
  FlatList, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  TouchableNativeFeedback, 
  RefreshControl, 
  BackHandler, 
  Platform, 
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import { Card, Text, Button, Header, Icon, Badge } from 'react-native-elements';
import { Global, Session } from '../helpers/Global';
import { Actions } from 'react-native-router-flux';
import ItemCard from '../components/ItemCard';
import DataNotFound from '../components/DataNotFound';
import { connect } from 'react-redux';
import { getPublic } from '../providers/Api';

class FilterPage extends Component {
  constructor(props){
    super(props);
    this.state = { refreshing: true, isLoggedIn: null, session: new Session() };
    console.log('test');
  }

  static navigationOptions = ({navigation}) => {
    const {params = {}, setParams} = navigation.state

    return {
      headerRight: (
        <View
          style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => params.pressSearch()}>
            <Icon
              name='search'
              type='feather'
              color='#555'
              disabled={true}
              containerStyle={{paddingRight: 16}} />
          </TouchableOpacity>
        </View>
      ),
      tabBarIcon: ({ focused }) => {return <TabIcon iconName="home" focused={focused} iconTitle="Home" />;},
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ pressSearch: this._onPressSearch });
  }

  _onPressSearch() {
    Actions.search({title: 'Search'});
  }

  componentDidMount(){
    return this._getData();
  }

  _getData() {
    console.log('public 1');
    var uri = 'product?search='+ this.props.search +'&category='+this.props.category+'&tag='+this.props.tag;
    getPublic(uri).then(response => {
      console.log(response ,'===== public =====');
      this.setState({
        refreshing: false
      });
      if (response.status == 200) {
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

  _onRefresh() {
    this.setState({refreshing: true});
    this._getData();
  }

  renderDataEmpty() {
    if (this.state.refreshing == false) {
      return <DataNotFound containerStyle={{ marginTop: 20 }}/>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar key="statusbar" backgroundColor="#fff" barStyle="dark-content" />
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
    );
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
    width: '100%',
  }
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);