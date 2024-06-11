/* eslint-disable prettier/prettier */
import React, {useContext, useState} from 'react';
import auth from '@react-native-firebase/auth';

import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../constent/colors';
import {images} from '../../constent/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../Login/UserContext';

const Model = ({navigation}) => {
  const {setUser} = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handalLogout = () => {
    auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('currentUser');
        setUser(null);
        Alert.alert('User signed out!');
      });
    setModalVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={images.MORE}
          style={styles.logout}
          tintColor={colors.white}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Profile');
              }}
              style={styles.btn}>
              <ImageBackground source={images.BTN_IMG} style={styles.image}>
                <Text style={styles.text}>Profile</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Settings');
              }}
              style={styles.btn}>
              <ImageBackground source={images.BTN_IMG} style={styles.image}>
                <Text style={styles.text}>Settings</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={handalLogout} style={styles.btn}>
              <ImageBackground source={images.BTN_IMG} style={styles.image}>
                <Text style={styles.text}>Logout</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  btn: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 10,
  },
  closeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
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

export default Model;
