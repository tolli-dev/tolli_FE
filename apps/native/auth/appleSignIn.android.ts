import { authorize } from 'react-native-app-auth';

const config = {
  issuer: 'https://appleid.apple.com',
  clientId: 'com.web.tolli',
  redirectUrl: 'https://tolli-fe-web.vercel.app/api/auth/apple/callback',
  scopes: [],
  additionalParameters: {},
};

export const signInWithApple = async (): Promise<string | null> => {
  const result = await authorize(config);
  return result.idToken ?? null;
};
