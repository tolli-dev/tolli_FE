import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Platform, StatusBar, NativeModules } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { signInWithGoogle } from './auth/googleSignIn';
import { signInWithApple } from './auth/appleSignIn';
import { IP_URL } from '../web/src/constants/url';
import { KakaoOAuthToken, login } from '@react-native-seoul/kakao-login';
import { checkFirstLaunch, markFirstLaunchDone } from './utils/checkFirstLaunch';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
});

export default function App() {
  const webviewRef = useRef<WebViewType>(null);
  const [initialUri, setInitialUri] = useState<string | null>(null);

  useEffect(() => {
    checkFirstLaunch().then((isFirst) => {
      setInitialUri(isFirst ? `${IP_URL}/onboarding/1` : `${IP_URL}/afterLogin/setAlarm`);
    });
  }, []);

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

      if (data.type === 'ONBOARDING_COMPLETE') {
        await markFirstLaunchDone();
      }

      if (data.type === 'REQUEST_NOTIFICATION_PERMISSION') {
        await Notifications.requestPermissionsAsync();
      }

      if (data.type === 'SCHEDULE_NOTIFICATION') {
        await Notifications.cancelAllScheduledNotificationsAsync();
        // TODO: 실제 시간 기반 알림 전환 시 아래 trigger로 교체
        // trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: data.hour, minute: data.minute }
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '오늘의 말씀 🕊️',
            body: '말씀으로 하루를 시작해요!',
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60, repeats: true },
        });
      }
    } catch (error: any) {
      if (
        error.code === 'SIGN_IN_CANCELLED' ||
        error.code === 'ERR_REQUEST_CANCELED' ||
        error.code === 'E_CANCELLED_OPERATION' ||
        /user cancelled/i.test(error.message)
      )
        return;
      console.error('[handleMessage] error:', error);
    }
  };

  if (!initialUri) return null;

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: initialUri }}
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
