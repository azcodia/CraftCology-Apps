# React Native Accordion
[![npm](https://img.shields.io/npm/v/@ercpereda/react-native-accordion.svg?style=flat-square)](https://www.npmjs.com/package/@ercpereda/react-native-accordion)
[![npm downloads](https://img.shields.io/npm/dm/@ercpereda/react-native-accordion.svg?style=flat-square)](https://www.npmjs.com/package/@ercpereda/react-native-accordion)

__`react-native-accordion`__ is an easy to use Accordion component for [React Native](https://facebook.github.io/react-native/) app.

![accordion](https://cloud.githubusercontent.com/assets/1627824/7762243/801c1e46-ffff-11e4-9a36-2183704b6ec6.gif)

## Preview
Using the [expo project](https://expo.io/@ercpereda/react-native-accordion-example)

## Install
```shell
npm i --save @ercpereda/react-native-accordion
```

## Usage
Using an Accordion in your app will usually look like this:
```jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accordion from '@ercpereda/react-native-accordion';

const Header = ({ isOpen }) =>
  <View style={{
      paddingTop: 15,
      paddingRight: 15,
      paddingLeft: 15,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#a9a9a9',
      backgroundColor: '#f9f9f9',
    }}>
      <Text>{`${isOpen ? '-' : '+'} Click to Expand`}</Text>
    </View>;

const Content = (
  <View style={{
      display: 'flex',
      backgroundColor: '#31363D'
    }}>
      <Text style={{
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        color: '#fff',
      }}>
        This content is hidden in the accordion
      </Text>
    </View>);

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Accordion
          header={Header}
          content={Content}
          duration={300}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Examples
Here are a few examples of how you can use an accordion in your app:

|Transit App|Tweetbot|
|---|---|
|[![accordion-transit](https://cloud.githubusercontent.com/assets/1627824/7757509/ffee4358-ffd0-11e4-9fc5-13c8d6f09ad0.gif)](https://itunes.apple.com/ca/app/transit-app-real-time-bus/id498151501)|[![accordion-tweetbot](https://cloud.githubusercontent.com/assets/1627824/7757570/6b391106-ffd1-11e4-9191-e501e81ca506.gif)](https://itunes.apple.com/ca/app/tweetbot-3-for-twitter.-elegant/id722294701)|

## Props
The following props can be used to modify the Accordion's style and/or behaviour:

| Prop | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|__`activeOpacity`__|_Number_|Optional|`1`|The active opacity of the [TouchableHighlight](https://facebook.github.io/react-native/docs/touchablehighlight.html).
|__`animationDuration`__|_Number_|Optional|`300`|The duration of the animation.
|__`content`__|_Element_|Required|`N/A`|The content you want hidden in the collapse accordion.
|__`easing`__|_String_|Optional|`linear`| A tweening function from [tween-functions](https://github.com/chenglou/tween-functions).
|__`expanded`__|_Boolean_|Optional|`false`|If the accordion is expanded by default when mounted.
|__`header`__|_Element_|Required|`N/A`|The element that will expand the accordion when pressed.
|__`onPress`__|_Function_|Optional|`N/A`|A function that will be called when the accordion is pressed.
|__`underlayColor`__|_String_|Optional|`#000`|The underlay color of the [TouchableHighlight](https://facebook.github.io/react-native/docs/touchablehighlight.html).
|__`style`__|_Object_|Optional|`{}`|The styles you want to set on the accordion element.

## Methods
The following methods can be used to open and close the accordion:

| Method | Parameters | Note |
|---|---|---|
|__`open`__|`N/A`|Open the accordion.
|__`close`__|`N/A`|Close the accordion.
|__`toggle`__|`N/A`|Toggle the accordion.

## License
Copyright (c) 2015, [Naoufal Kadhom](http://naoufal.com)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
