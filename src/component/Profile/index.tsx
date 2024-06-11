/* eslint-disable prettier/prettier */
import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {UserContext} from '../Login/UserContext';

import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../constent/colors';
import {images} from '../../constent/images';

const Profile = ({navigation}) => {
  const {currentUser, setUser} = useContext(UserContext);

  console.log(currentUser);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('currentUser');
        setUser(null);
        Alert.alert('User signed out!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <LinearGradient
      colors={['#43116A', '#68E1FD']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gradient}>
      <View style={styles.list}>
        <View style={styles.header}>
          <Image
            source={
              currentUser?.avatar ? {uri: currentUser.avatar} : images.PROFILE
            }
            alt="Profile"
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.section}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{currentUser.name}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{currentUser.email}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{currentUser.phone}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.btn}>
          <ImageBackground source={images.BTN_IMG} style={styles.image}>
            <Text style={styles.text}>Logout</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
  },
  email: {
    fontSize: 16,
    color: colors.black,
  },
  body: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  section: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  value: {
    width: '100%',
    marginLeft: 5,
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  btn: {
    borderRadius: 34,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 48,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;
