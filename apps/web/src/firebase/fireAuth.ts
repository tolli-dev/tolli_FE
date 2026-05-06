import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithCredential, signInWithRedirect } from 'firebase/auth';
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
