/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constent/colors';

const Story = ({user}) => {
  return (
    <View style={styles.story}>
      <View style={styles.circle}>
        <Image source={user.avatar} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {user.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  story: {
    marginRight: 15,
    alignItems: 'center',
  },
  circle: {
    padding: 3,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#68E1FD',
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyName: {
    marginTop: 5,
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default Story;
