/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../constent/colors';
import DataList from '../DataList';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <DataList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Home;
