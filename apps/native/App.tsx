import { useRef } from "react";
import { StyleSheet, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import type {
  WebView as WebViewType,
  WebViewMessageEvent,
} from "react-native-webview";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { signInWithGoogle } from "./auth/googleSignIn";
import { signInWithApple } from "./auth/appleSignIn";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
});

export default function App() {
  const webviewRef = useRef<WebViewType>(null);
  const IP_URL = "http://192.168.1.177:3000";

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
        const idToken = await signInWithApple();
        if (idToken) postToken("APPLE_TOKEN", idToken);
      }

      // if (data.type === "KAKAO_LOGIN") {
      //   const returnUrl = Linking.createURL("");
      //   const result = await WebBrowser.openAuthSessionAsync(
      //     data.url,
      //     returnUrl,
      //   );
      //   if (result.type === "success") {
      //     webviewRef.current?.reload();
      //   }
      // }
    } catch (error: any) {
      if (
        error.code === "SIGN_IN_CANCELLED" ||
        error.code === "ERR_REQUEST_CANCELED"
      )
        return;
      console.error("[handleMessage] error:", error);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: "http://192.168.1.177:3000" }}
      style={styles.container}
      onMessage={handleMessage}
      onShouldStartLoadWithRequest={(request) => {
        const { url } = request;

        // http, https 등 일반적인 웹 이동은 허용
        if (
          url.startsWith("http://") ||
          url.startsWith("https://") ||
          url.startsWith("about:blank")
        ) {
          return true;
        }

        // intent:// 나 kakaotalk:// 같은 외부 앱 스킴이 들어오면 외부 앱 열기 시도
        Linking.openURL(url).catch(() => {
          console.log(
            "해당 앱(카카오톡)이 설치되어 있지 않거나 열 수 없습니다.",
          );
        });

        return false; // 웹뷰 내부에서는 알 수 없는 스킴 이동 방지
      }}
      scalesPageToFit={false}
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      allowsLinkPreview={false}
      contentInsetAdjustmentBehavior="never"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
