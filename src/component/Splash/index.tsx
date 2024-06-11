/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../../constent/images';

const Splash = ({navigation}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Intro');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43116A', '#68E1FD']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 2}}
        style={styles.gradient}>
        <View style={styles.imageContainer}>
          <Image source={images.MESSAGES_BOX} style={styles.image} />
          <Text style={styles.text}>Textit</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
  },
  text: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -100}, {translateY: -100}],
    color: 'white',
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Splash;
