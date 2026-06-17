import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const signInWithGoogle = async (): Promise<string | null> => {
  await GoogleSignin.hasPlayServices();
  if (GoogleSignin.getCurrentUser()) {
    await GoogleSignin.signOut();
  }
  const userInfo = await GoogleSignin.signIn();
  return userInfo.data?.idToken ?? null;
};
