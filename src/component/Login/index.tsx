/* eslint-disable prettier/prettier */
import auth from '@react-native-firebase/auth';
import React, {useContext, useState, useEffect} from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {UserContext} from './UserContext';
import {images} from '../../constent/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
const defaultAvatar = require('../../asset/images/profile.jpg');
import firestore from '@react-native-firebase/firestore';
import { colors } from '../../constent/colors';

GoogleSignin.configure({
  webClientId:
    '115506952686-imrpatcn5cah5mgh0cauu1ttspv75auc.apps.googleusercontent.com',
  offlineAccess: true,
});

const Login = ({navigation}: any) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const {user, setUser, setCurrentUser, currentUser} = useContext(UserContext);
  const ref = firestore().collection('users');

  const handleSubmit = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setUser(user);
        setEmail('');
        setPassword('');
        AsyncStorage.setItem('token', JSON.stringify(user));
        Alert.alert('User login successful!');
        navigation.navigate('Home', {name: user.email});
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          console.log('Wrong password provided!');
        } else if (error.code === 'auth/user-not-found') {
          console.log('User not found!');
        } else {
          console.error(error);
        }
      });
  };

  useEffect(() => {
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

      if (user) {
        const currentUserData = list.find(u => u.id === user.uid);
        setCurrentUser(currentUserData);
        AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    });

    return () => unsubscribe();
  }, [user]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
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
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginBox}>
        <View style={styles.contentBox}>
          <Text style={styles.title}>Log in to Chatbox</Text>
          <Text style={styles.welcome}>
            Welcome back! Sign in using your social account or email to continue
            us
          </Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Your Email</Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}
            value={email}
          />
          <Text style={styles.label}>Your Password</Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
            <ImageBackground source={images.BTN_IMG} style={styles.image}>
              <Text style={styles.text}>Login</Text>
            </ImageBackground>
          </TouchableOpacity>

          <View style={styles.bottom}>
            <View style={styles.orLines}>
              <View style={styles.orLine}></View>
              <Text>OR</Text>
              <View style={styles.orLine}></View>
            </View>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={signIn}
              style={styles.googleBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    width: '80%',
    height: '70%',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    height: 40,
    color:colors.black,
    backgroundColor:colors.white,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: colors.primary,
    marginBottom: 30,
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  welcome: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  googleBtn: {
    marginBottom: 20,
  },
  orLines: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CDD1D0',
  },
  inputBox: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
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
  bottom: {alignItems: 'center'},
});

export default Login;
