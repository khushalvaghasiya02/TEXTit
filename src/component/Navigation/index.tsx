/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constent/colors';
import { images } from '../../constent/images';
import Chat from '../Chat';
import DataList from '../DataList';
import Home from '../Home';
import Intro from '../Intro';
import Login from '../Login';
import { UserContext } from '../Login/UserContext';
import Model from '../Model';
import Profile from '../Profile';
import Registration from '../Registration';
import Setting from '../Setting';
import Splash from '../Splash';

const Stack = createStackNavigator();

const BackButton = ({tintColor}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}>
      <Image
        source={images.BACK_ARROW}
        style={styles.backButtonText}
        tintColor={tintColor}></Image>
    </TouchableOpacity>
  );
};

function MyStack() {
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const [showHeaderLeft, setShowHeaderLeft] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeaderLeft(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        animated={true}
        backgroundColor="#43116A"
        barStyle="light-content"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Home"
          component={Home}
          options={({navigation}) => ({
            headerLeft: () =>
              showHeaderLeft ? (
                <View style={styles.header}>
                  <Image
                    source={
                      currentUser?.avatar
                        ? { uri: currentUser.avatar }
                        : images.PROFILE
                    }
                    alt="Profile"
                    style={styles.loginProfile}
                  />
                  <Text style={styles.text}>{currentUser?.name}</Text>
                </View>
              ) : null,
            headerRight: () => <Model navigation={navigation} />,
            title: '',
            headerTransparent: true,
            headerStyle: {backgroundColor: 'transparent'},
            headerTintColor: 'white',
          })}
        />

        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerLeft: () => <BackButton tintColor={colors.white} />,
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTitleStyle: {
              color: '#fff',
            },
          }}
        />

        <Stack.Screen name="Settings" component={Setting} />
        <Stack.Screen name="DataList" component={DataList} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({route}) => ({
            headerLeft: () => (
              <View style={styles.headerLeftContainer}>
                <BackButton tintColor={colors.black} />
                {route.params && route.params.avatar ? (
                  <Image source={route.params.avatar} style={styles.profile} />
                ) : null}
              </View>
            ),
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity>
                  <Image source={images.CALL} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={images.VIDEO_CALL} style={styles.icon} />
                </TouchableOpacity>
              </View>
            ),
            title:
              route.params && route.params.name ? route.params.name : 'Chat',
            headerStyle: {backgroundColor: colors.white},
            headerTintColor: colors.black,
          })}
        />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center',marginLeft:10},
  profile: {
    width: 30,
    height: 30,
    borderRadius: 34,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
  },
  loginProfile: {
    width: 35,
    height: 35,
    borderRadius: 34,
    marginLeft: 10,
    marginRight: 10,
  },
  logout: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyStack;
