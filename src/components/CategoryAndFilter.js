import React, { Component } from 'react';

import { StyleSheet, ActivityIndicator, Text, View, TouchableOpacity, RefreshControl, FlatList, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, ListItem, Icon } from 'react-native-elements';
import Accordion from '@ercpereda/react-native-accordion';
import { Global } from '../helpers/Global';
import { getPublic } from '../providers/Api';

export default class CategoryAndFilter extends Component {

  constructor(props){
    super(props);
    this.state = {
      refreshing: true,
      filters: [],
    }
  }

  componentWillMount() {
    this.getCategories();
  }

  getCategories() {
    var uri = 'product/categories';
    getPublic(uri).then(response => {
      if (response.status == 200) {
        this.setState({
          refreshing: false,
          categories: response.data.data,
          tags: response.data.tags
        });
      }
    });
  }

  _onPressCategoryDetail(item) {
    Actions.filterPage({title: item.name, search: '', category: item.id, tag: ''});
  }

  _onPressTagDetail(item) {
    Actions.filterPage({title: item.name, search: '', category: '', tag: item.id});
  }

  _renderItemCategory(item) {
    const Header = ({ isOpen }) =>
      <ListItem
        title={item.name}
        titleStyle={{
          marginLeft: -10
        }}
        containerStyle={{
          borderBottomColor: '#ddd'
        }}
        rightIcon={isOpen ? <Icon name='minus' type='feather' color='#000' size={10}/> : <Icon name='plus' type='feather' color='#000' size={10}/> }
      />;
    const Content = item.category_children.map((children) => 
        <TouchableOpacity onPress={() => this._onPressCategoryDetail(children)}>
          <Text style={{marginLeft: 8, paddingTop: 12, paddingBottom: 12, borderBottomColor: '#ddd', borderBottomWidth: 1, color: '#000'}}>{children.name}</Text>
        </TouchableOpacity>
    );

    return (
      <Accordion
        underlayColor={'#ddd'}
        header={Header}
        content={Content}
        duration={300}
      />
    );
  }

  _renderItemTag(item) {
    return (<View>
      <TouchableOpacity onPress={() => this._onPressTagDetail(item)}>
        <Text style={{paddingTop: 12, paddingBottom: 12, color: '#000', borderBottomColor: '#ddd', borderBottomWidth: 1}}>{item.name}</Text>
      </TouchableOpacity>
    </View>);
  }

  render() {

    if (!this.state.categories) {
      return (
        <View style={styles.container}>
          <Text style={{
            paddingTop: 16
          }}/>
          <ActivityIndicator />
        </View>
      )
    }
    
    return (
        <View style={styles.container}>
          <ScrollView style={{ paddingLeft: 16, paddingRight: 16 }}>
          <FlatList
            data={this.state.categories}
            containerStyle={{ width: '100%', margin: 0, padding: 0}}
            refreshControl={
              <RefreshControl 
                refreshing={this.state.refreshing} />
            }
            renderItem={({item}) => this._renderItemCategory(item)}
          />
          
          <Text style={{
            fontSize: 18,
            marginTop: 30,
            marginBottom: 10
          }}>
            Tag
          </Text>
          <FlatList
            data={this.state.tags}
            refreshControl={
              <RefreshControl 
                refreshing={this.state.refreshing} />
            }
            renderItem={({item}) => this._renderItemTag(item)}
          />
          </ScrollView>
        </View >
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
});