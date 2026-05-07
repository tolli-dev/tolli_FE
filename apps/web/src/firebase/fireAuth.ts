import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
  OAuthProvider,
} from 'firebase/auth';
import app from '@/firebase/firebaseConfig';

export const fireAuth = getAuth(app);

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(fireAuth, provider);
};

export const getAuthToken = async (): Promise<string | null> => {
  const result = await getRedirectResult(fireAuth);
  if (!result) return null;
  return result.user.getIdToken();
};

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
