import { WebView } from "react-native-webview";
import { StyleSheet, Platform } from "react-native";
import { useWebViewAuth } from "./src/hooks/useWebViewAuth";

export default function App() {
  const { onShouldStartLoadWithRequest } = useWebViewAuth();
  const customUserAgent =
    Platform.OS === "android"
      ? "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";

  return (
    <WebView
      source={{ uri: "http://192.168.35.166:3000" }}
      style={styles.container}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      originWhitelist={[
        "http://*",
        "https://",
        "file://*",
        "sms://*",
        "intent://*",
      ]}
      userAgent={customUserAgent}
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
