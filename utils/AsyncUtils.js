import React from 'react';
import { AsyncStorage } from 'react-native';

export const saveTimers = async (timersArray) => {
    try {
      const timersString = JSON.stringify(timersArray);
      await AsyncStorage.setItem('@SavedEvents',timersString);
    } catch (error) {
      console.error(error)
    }
  };