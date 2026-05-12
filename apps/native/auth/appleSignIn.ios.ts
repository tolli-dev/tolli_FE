import * as AppleAuthentication from 'expo-apple-authentication';

export const signInWithApple = async (): Promise<string | null> => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  return credential.identityToken;
};
