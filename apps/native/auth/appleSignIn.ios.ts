import * as AppleAuthentication from 'expo-apple-authentication';

export const signInWithApple = async (): Promise<{ idToken: string; rawNonce: string } | null> => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  if (!credential.identityToken) return null;
  return { idToken: credential.identityToken, rawNonce: '' };
};
