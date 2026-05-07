import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
});

export default function App() {
  const webviewRef = useRef<WebViewType>(null);

  const handleMessage = async (e: WebViewMessageEvent) => {
    try {
      const { type } = JSON.parse(e.nativeEvent.data);
      if (type === 'GOOGLE_LOGIN') {
        await GoogleSignin.signIn();
        const user = GoogleSignin.getCurrentUser();
        if (!user) return;
        const { idToken } = await GoogleSignin.getTokens();
        if (idToken) {
          webviewRef.current?.postMessage(JSON.stringify({ type: 'GOOGLE_TOKEN', token: idToken }));
        }
      }

      if (type === 'APPLE_LOGIN') {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        const { identityToken } = credential;
        if (identityToken) {
          webviewRef.current?.postMessage(
            JSON.stringify({ type: 'APPLE_TOKEN', token: identityToken }),
          );
        }
      }
    } catch (error: any) {
      if (error.code === 'SIGN_IN_CANCELLED' || error.code === 'ERR_REQUEST_CANCELED') return;
      console.error('[handleMessage] error:', error);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: 'http://192.168.0.46:3000' }}
      style={styles.container}
      onMessage={handleMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
