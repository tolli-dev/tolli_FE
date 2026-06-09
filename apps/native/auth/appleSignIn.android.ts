import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

const APPLE_AUTH_URL = 'https://appleid.apple.com/auth/authorize';

export const signInWithApple = async (): Promise<string | null> => {
  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);

  const params = new URLSearchParams({
    client_id: 'com.web.tolli',
    redirect_uri: 'https://tolli-fe-web.vercel.app/api/auth/apple/callback',
    response_type: 'code',
    response_mode: 'form_post',
    scope: '',
    nonce: hashedNonce,
  });

  await WebBrowser.openBrowserAsync(`${APPLE_AUTH_URL}?${params.toString()}`);
  return null;
};
