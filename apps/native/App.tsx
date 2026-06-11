import {
  StyleSheet,
  Platform,
  StatusBar,
  PermissionsAndroid,
  Linking,
  BackHandler,
  ToastAndroid,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { signInWithGoogle } from "./auth/googleSignIn";
import { signInWithApple } from "./auth/appleSignIn";
import { getCornerRadius } from "./modules/corner-radius";
import { useRef, useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import type {
  WebView as WebViewType,
  WebViewMessageEvent,
} from "react-native-webview";
import * as Notifications from "expo-notifications";

import { IP_URL } from "../web/src/constants/url";
import {
  KakaoOAuthToken,
  login,
  getProfile as getKakaoProfile,
} from "@react-native-seoul/kakao-login";
import {
  checkFirstLaunch,
  markFirstLaunchDone,
} from "./utils/checkFirstLaunch";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "기본 알림",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
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

  const isExitApp = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onExit = () => {
      if (!isExitApp.current) {
        isExitApp.current = true;
        ToastAndroid.show(
          "뒤로 버튼을 한 번 더 누르시면 종료됩니다.",
          ToastAndroid.SHORT,
        );
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

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onExit,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      // alarmEnabled 키가 없는 기존 유저 마이그레이션 (최초 1회)
      const migrated = await AsyncStorage.getItem("alarmEnabledMigrated");
      if (migrated === null) {
        const alarmTime = await AsyncStorage.getItem("alarmTime");
        if (alarmTime !== null) {
          await AsyncStorage.setItem("alarmEnabled", "true");
        }
        await AsyncStorage.setItem("alarmEnabledMigrated", "true");
      }

      const isFirst = await checkFirstLaunch();
      if (isFirst) {
        setInitialUri(`${IP_URL}/onboarding/1`);
      } else {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        setInitialUri(
          isLoggedIn === "true" ? `${IP_URL}/dashboard` : `${IP_URL}/login`,
        );
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

      if (data.type === "GOOGLE_LOGIN") {
        const idToken = await signInWithGoogle();
        if (idToken) postToken("GOOGLE_TOKEN", idToken);
      }

      if (data.type === "APPLE_LOGIN") {
        const appleResult = await signInWithApple();
        if (appleResult) {
          webviewRef.current?.postMessage(
            JSON.stringify({
              type: "APPLE_TOKEN",
              token: appleResult.idToken,
              rawNonce: appleResult.rawNonce,
            }),
          );
        }
      }

      if (data.type === "KAKAO_LOGIN") {
        const token: KakaoOAuthToken = await login();
        if (token) {
          const profile = await getKakaoProfile();
          if (profile.id) postToken("KAKAO_TOKEN", String(profile.id));
        }
      }

      if (data.type === "WEB_READY") {
        const radius = await getCornerRadius();
        const cssRadius = Math.round(radius);
        webviewRef.current?.postMessage(
          JSON.stringify({ type: "DEVICE_CORNER_RADIUS", value: cssRadius }),
        );
      }

      if (data.type === "RECORD_READY") {
        if (Platform.OS === "android") {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          let status: "granted" | "denied" | "blocked";

          if (result === PermissionsAndroid.RESULTS.GRANTED) status = "granted";
          else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
            status = "blocked";
          else status = "denied";

          webviewRef.current?.postMessage(
            JSON.stringify({
              type: "RECORD_PERMISSION",
              status,
            }),
          );
        } else {
          webviewRef.current?.postMessage(
            JSON.stringify({ type: "RECORD_PERMISSION", status: "granted" }),
          );
        }
      }

      if (data.type === "OPEN_APP_SETTINGS") {
        Linking.openSettings();
      }

      if (data.type === "ONBOARDING_COMPLETE") {
        await markFirstLaunchDone();
      }

      if (data.type === "SET_LOGGED_IN") {
        await AsyncStorage.setItem("isLoggedIn", "true");
      }

      if (data.type === "SET_LOGGED_OUT") {
        await AsyncStorage.removeItem("isLoggedIn");
        await AsyncStorage.removeItem("alarmTime");
        await AsyncStorage.removeItem("alarmEnabled");
      }

      if (data.type === "CLEAR_ALL_DATA") {
        await AsyncStorage.removeItem("isLoggedIn");
        await AsyncStorage.removeItem("alarmTime");
        await AsyncStorage.removeItem("alarmEnabled");
        await AsyncStorage.removeItem("alarmEnabledMigrated");
      }

      if (data.type === "REQUEST_NOTIFICATION_PERMISSION") {
        const { status } = await Notifications.requestPermissionsAsync();
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: "NOTIFICATION_PERMISSION_RESULT",
            granted: status === "granted",
          }),
        );
      }

      if (data.type === "QUERY_NOTIFICATION_STATUS") {
        const enabled = await AsyncStorage.getItem("alarmEnabled");
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: "NOTIFICATION_STATUS",
            enabled: enabled === "true",
          }),
        );
      }

      if (data.type === "CANCEL_NOTIFICATION") {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem("alarmEnabled");
      }

      if (data.type === "OPEN_EXTERNAL_URL") {
        await Linking.openURL(data.url);
      }

      if (data.type === "SAVE_ALARM_TIME") {
        await AsyncStorage.setItem(
          "alarmTime",
          JSON.stringify({ hour: data.hour, minute: data.minute }),
        );
        await AsyncStorage.setItem("alarmEnabled", "true");
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "오늘의 말씀 🐘",
            body: "톨리가 오늘의 말씀을 가져왔어요!",
            sound: "default",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: data.hour,
            minute: data.minute,
          },
        });
      }

      if (data.type === "GET_ALARM_TIME") {
        const stored = await AsyncStorage.getItem("alarmTime");
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: "ALARM_TIME",
            ...(stored ? JSON.parse(stored) : { hour: null, minute: null }),
          }),
        );
      }

      if (data.type === "SCHEDULE_NOTIFICATION") {
        await AsyncStorage.setItem("alarmEnabled", "true");
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "오늘의 말씀 🐘",
            body: "톨리가 오늘의 말씀을 가져왔어요!",
            sound: "default",
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
        error.code === "SIGN_IN_CANCELLED" ||
        error.code === "ERR_REQUEST_CANCELED" ||
        error.code === "E_CANCELLED_OPERATION" ||
        /user cancelled/i.test(error.message)
      )
        return;
      console.error("[handleMessage] error:", error);
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
      />
      {!isLoaded && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ flex: 1, backgroundColor: "#1B1B1B" }} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#1B1B1B",
  },
});
