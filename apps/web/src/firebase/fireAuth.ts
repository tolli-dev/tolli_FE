import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithCustomToken as firebaseSignInWithCustomToken,
  OAuthProvider,
} from 'firebase/auth';
import app from '@/firebase/firebaseConfig';

export const fireAuth = getAuth(app);

export const signInWithGoogleToken = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(fireAuth, credential);
  return userCredential.user;
};

export const signInWithAppleToken = async (idToken: string, rawNonce?: string) => {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken, rawNonce: rawNonce || undefined });
  const userCredential = await signInWithCredential(fireAuth, credential);
  return userCredential.user;
};

export const signInWithKakaoToken = async (kakaoUid: string) => {
  const response = await fetch('/api/auth/kakao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kakaoUid }),
  });
  const { customToken } = await response.json();
  const userCredential = await firebaseSignInWithCustomToken(fireAuth, customToken);
  return userCredential.user;
};
