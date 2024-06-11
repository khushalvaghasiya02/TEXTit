/* eslint-disable prettier/prettier */
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { images } from '../../constent/images';
import { colors } from '../../constent/colors';

const Registration = ({navigation}:any) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');


  const ref = firestore().collection('users');
  const handleSubmit = async() => {
    const result = await auth()
      .createUserWithEmailAndPassword(email, password)
      ref.add({
        phone: phone,
        name: name,
        email: result.user.email,
        uid: result.user.uid,
      }) 
      .then(() => {
        setEmail('');
        setPassword('');
        navigation.navigate('Login');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginBox}
      >
        <View style={styles.contentBox}>
          <Text style={styles.title}>Registration to Chatbox</Text>
          <Text style={styles.welcome}>
          Get chatting with friends and family today by signing up for our chat app!
          </Text>

          <View style={styles.orLines}>
            <View style={styles.orLine}></View>
            <Text>OR</Text>
            <View style={styles.orLine}></View>
          </View>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          onChangeText={text => setName(text)}
          value={name}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <Text style={styles.label}>Phone No</Text>

         <TextInput
          placeholder="Enter your phone no"
          style={styles.input}
          onChangeText={text => setPhone(text)}
          value={phone}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
         <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
            <ImageBackground source={images.BTN_IMG} style={styles.image}>
              <Text style={styles.text}>Registration</Text>
            </ImageBackground>
          </TouchableOpacity>
        </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  loginBox: {
    width: '80%',
    height: '70%',
    borderRadius: 10,
    paddingVertical:50,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor:colors.white,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor:colors.primary,
    marginBottom: 30,
    color:colors.black
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
});
export default Registration