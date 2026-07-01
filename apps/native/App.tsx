import {
  StyleSheet,
  Platform,
  StatusBar,
  PermissionsAndroid,
  Linking,
  BackHandler,
  ToastAndroid,
  View,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { signInWithGoogle } from './auth/googleSignIn';
import { signInWithApple } from './auth/appleSignIn';
import { getCornerRadius } from './modules/corner-radius';
import { useRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

const IP_URL = 'https://tolli-fe-web.vercel.app';

// 네이티브 스플래시를 직접 숨길 때까지 유지 (자동 숨김 방지)
SplashScreen.preventAutoHideAsync();

import {
  KakaoOAuthToken,
  login,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import { checkFirstLaunch, markFirstLaunchDone } from './utils/checkFirstLaunch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NativeOfflineScreen from './components/NativeOfflineScreen';
import NetInfo from '@react-native-community/netinfo';
import NetworkBanner from './components/NetworkBanner';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: '기본 알림',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
});

export default function App() {
  const webviewRef = useRef<WebViewType>(null);
  const [initialUri, setInitialUri] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const isExitApp = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const offlineTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      clearTimeout(offlineTimer.current);
      if (!state.isInternetReachable) {
        offlineTimer.current = setTimeout(() => {
          setIsOffline(true);
        }, 1000);
      } else {
        setIsOffline(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(offlineTimer.current);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onExit = () => {
      if (!isExitApp.current) {
        isExitApp.current = true;
        ToastAndroid.show('뒤로 버튼을 한 번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
        timeout.current = setTimeout(() => {
          isExitApp.current = false;
        }, 2000);
      } else {
        clearTimeout(timeout.current);
        isExitApp.current = false; // ← 종료 전 상태 리셋
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onExit);
    return () => backHandler.remove();
  }, []);

  // SPLASH_READY가 끝내 안 오는 경우(웹 구버전/지연) 대비 안전 타임아웃
  useEffect(() => {
    const fallback = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    (async () => {
      // alarmEnabled 키가 없는 기존 유저 마이그레이션 (최초 1회)
      const migrated = await AsyncStorage.getItem('alarmEnabledMigrated');
      if (migrated === null) {
        const alarmTime = await AsyncStorage.getItem('alarmTime');
        if (alarmTime !== null) {
          await AsyncStorage.setItem('alarmEnabled', 'true');
        }
        await AsyncStorage.setItem('alarmEnabledMigrated', 'true');
      }

      const isFirst = await checkFirstLaunch();
      if (isFirst) {
        setInitialUri(`${IP_URL}/onboarding`);
      } else {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          setInitialUri(`${IP_URL}/dashboard`);
        } else {
          const permissionPending = await AsyncStorage.getItem('permissionPending');
          setInitialUri(
            permissionPending === 'true' ? `${IP_URL}/signup/permissions` : `${IP_URL}/login`,
          );
        }
      }
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
        const appleResult = await signInWithApple();
        if (appleResult) {
          webviewRef.current?.postMessage(
            JSON.stringify({
              type: 'APPLE_TOKEN',
              token: appleResult.idToken,
              rawNonce: appleResult.rawNonce,
            }),
          );
        }
      }

      if (data.type === 'KAKAO_LOGIN') {
        const token: KakaoOAuthToken = await login();
        if (token) {
          const profile = await getKakaoProfile();
          if (profile.id) postToken('KAKAO_TOKEN', String(profile.id));
        }
      }

      if (data.type === 'SPLASH_READY') {
        // 웹 레이아웃이 안정화(env safe-area 평가 완료)된 뒤 스플래시 숨김
        SplashScreen.hideAsync();
      }

      if (data.type === 'WEB_READY') {
        const radius = await getCornerRadius();
        const cssRadius = Math.round(radius);
        webviewRef.current?.postMessage(
          JSON.stringify({ type: 'DEVICE_CORNER_RADIUS', value: cssRadius }),
        );
      }

      if (data.type === 'RECORD_READY') {
        if (Platform.OS === 'android') {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          let status: 'granted' | 'denied' | 'blocked';

          if (result === PermissionsAndroid.RESULTS.GRANTED) status = 'granted';
          else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) status = 'blocked';
          else status = 'denied';

          webviewRef.current?.postMessage(
            JSON.stringify({
              type: 'RECORD_PERMISSION',
              status,
            }),
          );
        } else {
          webviewRef.current?.postMessage(
            JSON.stringify({ type: 'RECORD_PERMISSION', status: 'granted' }),
          );
        }
      }

      if (data.type === 'OPEN_APP_SETTINGS') {
        Linking.openSettings();
      }

      if (data.type === 'ONBOARDING_COMPLETE') {
        await markFirstLaunchDone();
      }

      if (data.type === 'SET_LOGGED_IN') {
        await AsyncStorage.setItem('isLoggedIn', 'true');
      }

      if (data.type === 'SET_PERMISSION_PENDING') {
        await AsyncStorage.setItem('permissionPending', 'true');
      }

      if (data.type === 'CLEAR_PERMISSION_PENDING') {
        await AsyncStorage.removeItem('permissionPending');
      }

      if (data.type === 'SET_LOGGED_OUT') {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('alarmTime');
        await AsyncStorage.removeItem('alarmEnabled');
        await AsyncStorage.removeItem('permissionPending');
      }

      if (data.type === 'CLEAR_ALL_DATA') {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('alarmTime');
        await AsyncStorage.removeItem('alarmEnabled');
        await AsyncStorage.removeItem('alarmEnabledMigrated');
        await AsyncStorage.removeItem('permissionPending');
      }

      if (data.type === 'REQUEST_NOTIFICATION_PERMISSION') {
        const { status } = await Notifications.requestPermissionsAsync();
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'NOTIFICATION_PERMISSION_RESULT',
            granted: status === 'granted',
          }),
        );
      }

      if (data.type === 'QUERY_NOTIFICATION_STATUS') {
        const enabled = await AsyncStorage.getItem('alarmEnabled');
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'NOTIFICATION_STATUS',
            enabled: enabled === 'true',
          }),
        );
      }

      // 온보딩 필수 권한 게이트: 실제 OS 권한 상태를 조회한다.
      // (재요청 없이 현재 상태만 반환 — 설정앱 복귀 후 재확인에 사용)
      if (data.type === 'QUERY_PERMISSION_STATUS') {
        const notificationSettings = await Notifications.getPermissionsAsync();
        let micGranted = false;
        if (Platform.OS === 'android') {
          micGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        }
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'PERMISSION_STATUS',
            notificationGranted: notificationSettings.status === 'granted',
            micGranted,
          }),
        );
      }

      if (data.type === 'CANCEL_NOTIFICATION') {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem('alarmEnabled');
      }

      if (data.type === 'OPEN_EXTERNAL_URL') {
        await Linking.openURL(data.url);
      }

      if (data.type === 'SAVE_ALARM_TIME') {
        await AsyncStorage.setItem(
          'alarmTime',
          JSON.stringify({ hour: data.hour, minute: data.minute }),
        );
        await AsyncStorage.setItem('alarmEnabled', 'true');
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '오늘의 말씀 🐘',
            body: '톨리가 오늘의 말씀을 가져왔어요!',
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: data.hour,
            minute: data.minute,
          },
        });
      }

      if (data.type === 'GET_ALARM_TIME') {
        const stored = await AsyncStorage.getItem('alarmTime');
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'ALARM_TIME',
            ...(stored ? JSON.parse(stored) : { hour: null, minute: null }),
          }),
        );
      }

      if (data.type === 'SCHEDULE_NOTIFICATION') {
        await AsyncStorage.setItem('alarmEnabled', 'true');
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '오늘의 말씀 🐘',
            body: '톨리가 오늘의 말씀을 가져왔어요!',
            sound: 'default',
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
    <>
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
        mixedContentMode="always"
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mediaCapturePermissionGrantType="grant"
        onLoadEnd={() => {
          setIsLoaded(true);
          webviewRef.current?.injectJavaScript(`
            (function() {
              if (window.__startBGM) window.__startBGM();
            })();
            true;
          `);
        }}
        onLoad={() => setHasLoadError(false)}
        onError={() => {
          setHasLoadError(true);
          // 로드 실패 시에도 스플래시는 숨겨 무한 스플래시 방지
          SplashScreen.hideAsync();
        }}
        renderError={() => <NativeOfflineScreen onRetry={() => webviewRef.current?.reload()} />}
      />
      {!isLoaded && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ flex: 1, backgroundColor: '#1B1B1B' }} />
        </View>
      )}
      {isOffline && !hasLoadError && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.12)' }]} />
      )}
      <NetworkBanner visible={isOffline && !hasLoadError} onRetry={() => NetInfo.refresh()} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#1B1B1B',
  },
});
