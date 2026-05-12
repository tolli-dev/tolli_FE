import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const signInWithGoogle = async (): Promise<string | null> => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo.data?.idToken ?? null;
};
