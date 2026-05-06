import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
});

export default function App() {
  const webviewRef = useRef<WebViewType>(null);

  const handleMessage = async (e: WebViewMessageEvent) => {
    console.log('RN received message:', e.nativeEvent.data);
    const { type } = JSON.parse(e.nativeEvent.data);
    if (type === 'GOOGLE_LOGIN') {
      console.log('Starting Google Sign In...');
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign In success:', JSON.stringify(userInfo));
      const { idToken } = await GoogleSignin.getTokens();
      if (idToken) {
        webviewRef.current?.postMessage(JSON.stringify({ type: 'AUTH_TOKEN', token: idToken }));
      }
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: 'http://192.168.0.7:3000' }}
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
