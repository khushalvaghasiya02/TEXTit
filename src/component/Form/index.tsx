/* eslint-disable prettier/prettier */
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';

const Form = () => {
  const [Title, setTitle] = useState('');
  const [Dec, setDec] = useState('');
  const [Todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const ref = firestore().collection('todos');

  // get to do data
  useEffect(() => {
    const allData = ref.onSnapshot(querySnapshot => {
      const list:any = [];
      querySnapshot.forEach(doc => {
        const {title, description} = doc.data();
        list.push({
          id: doc.id,
          title,
          description,
        });
      });
      setTodos(list);
    });

    return () => allData();
  }, []);

  //Add to do
  const handleSubmit = async () => {
    if (editId) {
      handleUpdate();
      return;
    }
    try {
      await ref.add({
        title: Title,
        description: Dec,
      });
      setTitle('');
      setDec('');
      Alert.alert('Your todo was added successfully!! 👍');
    } catch ({error}:any) {
      console.log(error);
      Alert.alert('Failed to add todo:', error.message);
    }
  };

  // to do edit
  const handleEdit = ({item}:any) => {
    setTitle(item.title);
    setDec(item.description);
    setEditId(item.id);
  };

  //to do update
  const handleUpdate = async () => {
    try {
      await ref.doc(editId).update({
        title: Title,
        description: Dec,
      });
      setTitle('');
      setDec('');
      setEditId(null);
      Alert.alert('Your todo was updated successfully!! 👍');
    } catch ({error}:any) {
      console.log(error);
      Alert.alert('Failed to update todo:', error.message);
    }
  };

  // to do delete
  const handleDelete = async ({id}:any) => {
    try {
      await ref.doc(id).delete();
      Alert.alert('Your todo was deleted successfully!! 👍');
    } catch ({error}:any) {
      Alert.alert('Failed to delete the todo:', error.message);
    }
  };

  const renderItem = ({item}:any) => (
    <View style={styles.card}>
      <View style={styles.line}>
        <Text style={styles.label}>Title: </Text>
        <Text>{item.title}</Text>
      </View>
      <View style={styles.line}>
        <Text style={styles.label}>Description: </Text>
        <Text>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'red'}]}
        onPress={() => handleDelete(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'green'}]}
        onPress={() => handleEdit(item)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.text}>TO DO List</Text>
          <View>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="Enter your Title"
              style={styles.input}
              onChangeText={text => setTitle(text)}
              value={Title}
            />
          </View>
          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Enter your description"
              style={styles.input}
              onChangeText={text => setDec(text)}
              value={Dec}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {editId ? 'Update' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
        <View>
          <FlatList
            data={Todos}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loginBox: {
    width: '80%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  card: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: '#000',
  },
  button: {
    backgroundColor: '#fbb03b',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  line: {
    flexDirection: 'row',
    gap: 3,
  },
});

export default Form;
