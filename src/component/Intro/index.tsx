/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {colors} from '../../constent/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../Login/UserContext';

const Intro = ({navigation}) => {
  const { setCurrentUser} = useContext(UserContext);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem('token');
      const currentUser = await AsyncStorage.getItem('currentUser');
      setCurrentUser(currentUser)
      if (user) {
        navigation.navigate('Home', { name: user });
      }
    } catch (error) {
      console.error('Error checking logged in status:', error);
    }
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      console.log('hello');
      const {idToken} = await GoogleSignin.signIn();
      console.log('idToken', idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);

      await auth().signInWithCredential(googleCredential);
      Alert.alert('Signed in with Google!');
      navigation.navigate('Home');
    } catch ({error}: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled the login process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available or outdated');
      } else {
        Alert.alert('Something went wrong with Google Sign In');
        console.error('Google Sign In Error:', error);
      }
    }
  };
  return (
    <View>
      <LinearGradient
        colors={['#43116A', '#68E1FD']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 2}}
        style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.text}>Connect friends easily & quickly</Text>
          <Text style={styles.paragraph}>
            Our chat app is the perfect way to stay connected with friends and
            family.
          </Text>
          <View style={styles.google}>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              style={styles.googleBtn}
              onPress={signIn}
            />
            <View style={styles.lines}>
              <View style={styles.line}></View>
              <Text>OR</Text>
              <View style={styles.line}></View>
            </View>
          </View>
          <View>
            <Pressable
              style={styles.signupBtn}
              onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.signupText}>Sign up with email</Text>
            </Pressable>

            <View style={styles.account}>
              <Text style={styles.accountText}>Existing account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.move}> Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    marginTop: 50,
  },
  text: {
    color: 'white',
    fontSize: 68,
    lineHeight: 78,
    letterSpacing: 2,
  },
  paragraph: {
    color: '#FFFFFF80',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 30,
    padding: 20,
  },
  google: {
    alignItems: 'center',
  },
  googleBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
  lines: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    width: '40%',
    height: 0,
    borderWidth: 1,
    borderColor: '#FFFFFF80',
  },
  signupBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 20,
  },
  signupText: {
    color: colors.black,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
  },
  account: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  move: {
    color: 'white',
    fontWeight: 'bold',
  },
  accountText: {
    color: '#FFFFFF80',
  },
});
export default Intro;
