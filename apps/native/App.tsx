import { useRef } from 'react';
import { StyleSheet, Platform, StatusBar, NativeModules } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { signInWithGoogle } from './auth/googleSignIn';
import { signInWithApple } from './auth/appleSignIn';
import { IP_URL } from '../web/src/constants/url';
import { KakaoOAuthToken, login } from '@react-native-seoul/kakao-login';

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
});

export default function App() {
  const webviewRef = useRef<WebViewType>(null);

  const postToken = (type: string, token: string) => {
    webviewRef.current?.postMessage(JSON.stringify({ type, token }));
  };

  const handleMessage = async (e: WebViewMessageEvent) => {
    if (!webviewRef.current) return;

    try {
      const data = JSON.parse(e.nativeEvent.data);

      if (data.type === 'GOOGLE_LOGIN') {
        const idToken = await signInWithGoogle();
        if (idToken) postToken('GOOGLE_TOKEN', idToken);
      }

      if (data.type === 'APPLE_LOGIN') {
        const idToken = await signInWithApple();
        if (idToken) postToken('APPLE_TOKEN', idToken);
      }

      if (data.type === 'KAKAO_LOGIN') {
        const token: KakaoOAuthToken = await login();
        if (token) postToken('KAKAO_TOKEN', token.accessToken);
      }

      if (data.type === 'WEB_READY') {
        const radius = await NativeModules.CornerRadiusModule.getCornerRadius();
        const cssRadius = Platform.OS === 'android' ? Math.round(radius * 0.5) : radius;
        webviewRef.current?.postMessage(
          JSON.stringify({ type: 'DEVICE_CORNER_RADIUS', value: cssRadius }),
        );
      }
    } catch (error: any) {
      if (
        error.code === "SIGN_IN_CANCELLED" ||
        error.code === "ERR_REQUEST_CANCELED" ||
        error.code === "E_CANCELLED_OPERATION" ||
        /user cancelled/i.test(error.message)
      )
        return;
      console.error("[handleMessage] error:", error);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: `${IP_URL}/study/30/2` }}
      style={styles.container}
      onMessage={handleMessage}
      contentInsetAdjustmentBehavior="never"
      scalesPageToFit={false}
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      allowsLinkPreview={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
