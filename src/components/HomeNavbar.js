import { 
  Image, 
  Platform, 
  StyleSheet, 
  TouchableOpacity, 
  View,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { 
  Icon, 
  Badge 
} from 'react-native-elements';
import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class HomeNavbar extends React.Component {

  renderLeft() {
    return (
      <SafeAreaView>
        <View
          style={styles.viewLeft}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => this.onPressSearch()}>
            <Icon
              name='search'
              type='feather'
              color='#555'
              disabled={true}
              onPress={() => this.onPressSearch()}
              containerStyle={styles.iconSearchContainer} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  renderMiddle() {
    return (
      <View style={styles.viewMiddle}>
        <Image source={require('./../images/logo-craft.png')} style={styles.logo} />
      </View>
    );
  }

  renderCartBadge() {
    if (this.props.carts.length <= 0) {
      return;
    }

    return (
      <Badge 
        containerStyle={styles.cartBadgeContainer}
        textStyle={styles.cartBadgeTextStyle}
        onPress={() => this.onPressCart()}
        value={this.props.carts.length} />
    )
  }

  onPressCart() {
    Actions.cart({
      title: 'Cart'
    });
  }

  onPressSearch() {
    Actions.search({
      title: 'Search'
    });
  }

  renderRight() {
    return (
      <SafeAreaView>
        <View style={styles.viewRight}>
          {this.renderCartBadge()}
          <TouchableOpacity activeOpacity={0.6}>
            <Icon
              name='shopping-cart'
              type='feather'
              color='#555'
              containerStyle={styles.iconCartContainer}
              onPress={() => this.onPressCart()} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          {this.renderLeft()}
          {this.renderMiddle()}
          {this.renderRight()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 48 : 54,
    flexDirection: "row",
    paddingTop: 3,
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1
  },
  navBarItem: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center"
  },
  viewLeft: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  viewMiddle: {
    flex: 1,
    justifyContent: "center"
  },
  viewRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: Platform.OS == "ios" ? 8 : 12
  },
  cartBadgeContainer: {
    position: "absolute",
    left: 35,
    padding: 8,
    top: -10,
    backgroundColor: "#ff4545",
    zIndex: 10
  },
  cartBadgeTextStyle: {
    fontSize: 11
  },
  iconSearchContainer: {
    paddingLeft: 16,
    paddingTop: Platform.OS == "ios" ? 8 : 12
  },
  iconCartContainer: {
    paddingLeft: 20,
    paddingRight: 20
  },
  logo: {
    width: Platform.OS == 'ios' ? 140 : 150,
    resizeMode: "contain",
    alignSelf: "center"
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavbar);