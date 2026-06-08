import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = 'isFirstLaunch';

export async function checkFirstLaunch(): Promise<boolean> {
  const value = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
  return value === null;
}

export async function markFirstLaunchDone(): Promise<void> {
  await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
}
