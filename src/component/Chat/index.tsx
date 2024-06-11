/* eslint-disable prettier/prettier */
import React, { useCallback, useContext, useEffect } from 'react';
import { GiftedChat, Bubble, InputToolbar, Time, Composer } from 'react-native-gifted-chat';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { UserContext } from '../Login/UserContext';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../../constent/colors';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = React.useState([]);
  const { currentUser } = useContext(UserContext);
  const { name, avatar, id: receiverId } = route.params;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(currentUser.uid)
      .collection(receiverId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMsg = snapshot.docs.map(docSnap => {
          return {
            ...docSnap.data(),
            createdAt: new Date(),
            user: {
              _id: docSnap.data().senderId,
              avatar: avatar,
            },
          };
        });
        setMessages(allMsg);
      });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      senderId: currentUser.uid,
      receiverId: receiverId,
      createdAt: new Date(),
    };

    firestore()
      .collection('chats')
      .doc(currentUser.uid)
      .collection(receiverId)
      .add(myMsg);

    firestore()
      .collection('chats')
      .doc(receiverId)
      .collection(currentUser.uid)
      .add(myMsg);
  }, []);

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.bubbleRight,
        left: styles.bubbleLeft,
      }}
      textStyle={{
        right: styles.textRight,
        left: styles.textLeft,
      }}
    />
  );

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.primaryInputToolbar}
      renderComposer={composerProps => (
        <Composer {...composerProps} textInputStyle={styles.textInput} />
      )}
    />
  );

  const renderSend = ({ text }) => (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => {
        onSend([{ text }]);
      }}>
      <Image
        source={require('../../asset/images/send.png')}
        style={styles.btnImg}
        tintColor={colors.white}
      />
    </TouchableOpacity>
  );

  const renderCustomTime = props => (
    <Time
      {...props}
      timeTextStyle={{
        left: styles.timeTextLeft,
        right: styles.timeTextRight,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUser.uid,
        }}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderTime={renderCustomTime}
        alwaysShowSend
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  bubbleRight: {
    backgroundColor: colors.primary,
  },
  bubbleLeft: {
    backgroundColor: colors.secondary,
  },
  textRight: {
    color: colors.white,
  },
  textLeft: {
    color: colors.black,
  },
  timeTextLeft: {
    color: colors.black,
  },
  timeTextRight: {
    color: colors.white,
  },
  textInput: {
    color: colors.black,
  },
  inputToolbar: {
    borderTopWidth: 2,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 30,
    backgroundColor: colors.white,
    color: colors.white,
  },
  primaryInputToolbar: {
    alignItems: 'center',
  },
  btn: {
    width: 35,
    height: 35,
    backgroundColor: colors.primary,
    borderRadius: 34,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 3,
  },
  btnImg: {
    width: 20,
    height: 20,
  },
});

export default ChatScreen;
