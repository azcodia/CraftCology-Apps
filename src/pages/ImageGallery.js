/**
* This is the Main file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Text, View, StatusBar, Platform } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Gallery from 'react-native-image-gallery';
import { Actions } from 'react-native-router-flux';

export default class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };

    this.onChangeImage = this.onChangeImage.bind(this);
  }

  componentWillMount() {
    this.setState({
      images: this.props.images,
      index: this.props.position
    });
  }

  get caption () {
    const { images, index } = this.state;
    return (
      <View style={{ bottom: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontStyle: 'italic' }}>{ (images[index] && images[index].caption) || '' } </Text>
      </View>
    );
  }

  onChangeImage (index) {
    this.setState({ index });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar key="statusbar" backgroundColor="#000" barStyle="light-content" />
        <Button 
          onPress={() => Actions.pop()}
          containerViewStyle={{position: 'absolute', zIndex: 10, backgroundColor:'transparent', left: -10, top: Platform.OS == 'ios' ? 24 : 0}}
          buttonStyle={{backgroundColor:'transparent'}}
          icon={{
            name: 'close',
            size: 22,
            color: 'white',
            type: 'material-community'
          }}
          />
        <Gallery
          initialPage={this.state.index ? this.state.index : 0}
          style={{flex: 1, backgroundColor: 'black'}}
          images={this.state.images}
          onPageSelected={this.onChangeImage}
        />
        { this.caption }
      </View>
    );
  }
}