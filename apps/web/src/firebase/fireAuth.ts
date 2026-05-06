import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '@/firebase/firebaseConfig';

const fireAuth = getAuth(app);

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(fireAuth, provider);
  const user = userCredential.user;
  console.log(user);
};
