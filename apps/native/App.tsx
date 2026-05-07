import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useRef } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export default function App() {
  const webviewRef = useRef<WebView | null>(null);

  const onMessage = async (event: WebViewMessageEvent) => {
    if (!webviewRef.current) return;
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "KAKAO_LOGIN") {
      const returnUrl = Linking.createURL("");

      const result = await WebBrowser.openAuthSessionAsync(data.url, returnUrl);

      if (result.type === "success") {
        webviewRef.current?.reload();
      }
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: "http://192.168.35.166:3000" }}
      style={styles.container}
      onMessage={onMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
