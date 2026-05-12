import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import app from '@/firebase/firebaseConfig';

export const fireAuth = getAuth(app);

export const signInWithGoogleToken = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(fireAuth, credential);
  return userCredential.user;
};

export const signInWithAppleToken = async (idToken: string) => {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken });
  const userCredential = await signInWithCredential(fireAuth, credential);
  return userCredential.user;
};
