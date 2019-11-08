import Autocomplete from 'react-native-autocomplete-input';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard
} from 'react-native';
import { Global } from '../helpers/Global';
import CategoryAndFilter from '../components/CategoryAndFilter';
import { Actions } from 'react-native-router-flux';
import { getPublic } from '../providers/Api';

class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      films: [],
      query: '',
      isLoad: false,
    };
  }

  findFilm(query) {
    if (query === '') {
      return [];
    }

    if (query.length < 3) {
      return [];
    }

    if (this.state.isLoad == false) {
      return this.state.films;
    }

    var autocompleteUri = 'product/autocomplete?search=' + query;
    setTimeout(() => {
      getPublic(autocompleteUri).then(response => {
        console.log("Cek Query Serach API")
        console.log(response)
        if (response.status == 200) {
          // this.setState({
          //   dataSource: response.data.data,
          // });
          this.setState({
            films: response.data.data,
          }, function(){
            const { films } = this.state;
            return films;
          });
        }
      });
    }, 500)
    return this.state.films;
  }

  onSearch() {
    let search = this.state.query;
    Actions.filterPage({title:search, search: search, category: ''});
  }

  render() {
    const { query } = this.state;
    const films = this.findFilm(query);

    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.autocompleteInputContainer}
          data={films}
          returnKeyType={"search"}
          onSubmitEditing={() => this.onSearch()}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text, isLoad: true })}
          placeholder="Search"
          keyboardType={"web-search"}
          renderItem={(title) => (
            <TouchableOpacity onPress={() => {
              this.setState({ isLoad: false, query: title });
              Keyboard.dismiss();
              setTimeout(() => {
                this.onSearch();
              }, 500);
            }}
            accessible={false}>
              <Text style={styles.itemText}>
                {title}
              </Text>
            </TouchableOpacity>
          )}
        />
        <ScrollView style={styles.scrollView}>
          <CategoryAndFilter/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 16
  },
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 25
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  autocompleteInputContainer: {
    paddingLeft: 6,
    paddingRight: 6,
  },
  itemText: {
    fontSize: 15,
    padding: 3,
  }
});

export default SearchPage;