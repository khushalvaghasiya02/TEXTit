/* eslint-disable prettier/prettier */
import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../constent/colors';
import firestore from '@react-native-firebase/firestore';
import {images} from '../../constent/images';
import {UserContext} from '../Login/UserContext';
import Story from '../Story';
import AsyncStorage from '@react-native-async-storage/async-storage';
const defaultAvatar = require('../../asset/images/profile.jpg');

const DataList = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const ref = firestore().collection('users');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserData = await AsyncStorage.getItem('currentUser');
        if (currentUserData) {
          const parsedCurrentUser = JSON.parse(currentUserData);
          setCurrentUser(parsedCurrentUser);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();

    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {name, email, phone, avatar} = doc.data();
        list.push({
          id: doc.id,
          name,
          email,
          phone,
          avatar: avatar ? {uri: avatar} : defaultAvatar,
        });
      });
     const chatList = list.filter(item => item.id !== currentUser?.uid);

      setUsers(chatList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.list}
      onPress={() =>
        navigation.navigate('Chat', {
          name: item.name,
          avatar: item.avatar,
          id: item.id,
        })
      }>
      <View style={styles.content}>
        <Image source={item.avatar} style={styles.profile} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.msg}>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#43116A', '#68E1FD']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <View style={styles.extra}>
          <View style={styles.stories}>
            <View style={styles.story}>
              <View style={styles.circle}>
                <Image
                  source={
                    currentUser && currentUser?.avatar && currentUser?.avatar
                      ? {uri: currentUser?.avatar}
                      : defaultAvatar
                  }
                  alt="Profile"
                  style={styles.storyImage}
                />
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                Add Story
              </Text>
              <View style={styles.plusIconContainer}>
                <Image source={images.PLUS_ICON} style={styles.plusIcon} />
              </View>
            </View>
            <FlatList
              data={users}
              renderItem={({item}) => <Story key={item.id} user={item} />}
              keyExtractor={item => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.arrow}>
            <Image
              source={images.LINE}
              style={styles.icon}
              tintColor={colors.lightGray}></Image>
          </View>
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  list: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  extra: {
    height: '30%',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    elevation: 5,
    overflow: 'hidden',
    paddingTop: 20,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 30,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  msg: {
    fontSize: 14,
    color: colors.lightGray,
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    position: 'absolute',
    top: 40,
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stories: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: 20,
    paddingLeft: 20,
    alignItems: 'center',
  },
  story: {
    marginRight: 15,
    alignItems: 'center',
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  storyName: {
    marginTop: 5,
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  circle: {
    padding: 3,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.white,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 25,
    height: 25,
    backgroundColor: colors.white,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    width: 20,
    height: 15,
    resizeMode: 'contain',
  },
});

export default DataList;
