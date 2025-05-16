import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  async function getStoredValue() {
    try {
      const item = await AsyncStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
    } catch (error) {
      console.error('Error getting data from AsyncStorage:', error);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStoredValue();
  }, [key]);

  const setValue = async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  return [storedValue, setValue, loading];
}

export default useAsyncStorage;