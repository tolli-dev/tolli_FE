import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Platform, StatusBar, NativeModules, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { signInWithGoogle } from './auth/googleSignIn';
import { signInWithApple } from './auth/appleSignIn';
import { IP_URL } from '../web/src/constants/url';
import { KakaoOAuthToken, login, getProfile as getKakaoProfile } from '@react-native-seoul/kakao-login';
import { checkFirstLaunch, markFirstLaunchDone } from './utils/checkFirstLaunch';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    (async () => {
      const isFirst = await checkFirstLaunch();
      if (isFirst) {
        setInitialUri(`${IP_URL}/onboarding/1`);
        return;
      }
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      setInitialUri(isLoggedIn === 'true' ? `${IP_URL}/dashboard` : `${IP_URL}/login`);
    })();
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
        if (token) {
          const profile = await getKakaoProfile();
          if (profile.id) postToken('KAKAO_TOKEN', String(profile.id));
        }
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

      if (data.type === 'SET_LOGGED_IN') {
        await AsyncStorage.setItem('isLoggedIn', 'true');
      }

      if (data.type === 'SET_LOGGED_OUT') {
        await AsyncStorage.removeItem('isLoggedIn');
      }

      if (data.type === 'REQUEST_NOTIFICATION_PERMISSION') {
        await Notifications.requestPermissionsAsync();
      }

      if (data.type === 'QUERY_NOTIFICATION_STATUS') {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        webviewRef.current?.postMessage(
          JSON.stringify({ type: 'NOTIFICATION_STATUS', enabled: scheduled.length > 0 }),
        );
      }

      if (data.type === 'CANCEL_NOTIFICATION') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }


      if (data.type === 'OPEN_EXTERNAL_URL') {
        await Linking.openURL(data.url);
      }

      if (data.type === 'SAVE_ALARM_TIME') {
        await AsyncStorage.setItem('alarmTime', JSON.stringify({ hour: data.hour, minute: data.minute }));
      }

      if (data.type === 'GET_ALARM_TIME') {
        const stored = await AsyncStorage.getItem('alarmTime');
        webviewRef.current?.postMessage(
          JSON.stringify({ type: 'ALARM_TIME', ...(stored ? JSON.parse(stored) : { hour: null, minute: null }) }),
        );
      }

      if (data.type === 'SCHEDULE_NOTIFICATION') {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '오늘의 말씀 🕊️',
            body: '말씀으로 하루를 시작해요!',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: data.hour,
            minute: data.minute,
          },
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
