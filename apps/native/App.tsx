import { useRef } from "react";
import { StyleSheet } from "react-native";
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

      if (data.type === "KAKAO_LOGIN") {
        const returnUrl = Linking.createURL("");
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          returnUrl,
        );
        if (result.type === "success") {
          webviewRef.current?.reload();
        }
      }
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
      source={{ uri: " http://192.168.35.166:3000" }}
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
