import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

const APPLE_AUTH_URL = 'https://appleid.apple.com/auth/authorize';

export const signInWithApple = async (): Promise<{ idToken: string; rawNonce: string } | null> => {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  const params = new URLSearchParams({
    client_id: 'com.web.tolli',
    redirect_uri: 'https://tolli-fe-web.vercel.app/api/auth/apple/callback',
    response_type: 'code',
    response_mode: 'form_post',
    scope: '',
    nonce: hashedNonce,
  });

  const result = await WebBrowser.openAuthSessionAsync(
    `${APPLE_AUTH_URL}?${params.toString()}`,
    'tolli://',
  );

  if (result.type !== 'success') return null;

  const url = new URL(result.url);
  const idToken = url.searchParams.get('id_token');
  if (!idToken) return null;

  return { idToken, rawNonce };
};
