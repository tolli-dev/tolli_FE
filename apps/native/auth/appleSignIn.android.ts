import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

const APPLE_AUTH_URL = 'https://appleid.apple.com/auth/authorize';

export const signInWithApple = async (): Promise<string | null> => {
  const clientId = Constants.expoConfig?.extra?.appleClientId;
  // TODO: 배포 후 Vercel 도메인으로 변경 & Apple Services ID Return URL에 동일 도메인 등록하기!
  const redirectUri = 'https://your-vercel-domain.vercel.app/api/auth/apple/callback';

  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);

  const request = new AuthSession.AuthRequest({
    clientId,
    scopes: ['name', 'email'],
    redirectUri,
    responseType: AuthSession.ResponseType.Token,
    extraParams: {
      response_mode: 'fragment',
      nonce: hashedNonce,
    },
  });

  const result = await request.promptAsync({
    authorizationEndpoint: APPLE_AUTH_URL,
  });

  if (result.type !== 'success') return null;
  return result.params.id_token ?? null;
};
