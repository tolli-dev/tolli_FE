import { Linking, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";
import { Platform } from "react-native";

const parseIntentUrl = (url: string) => {
  if (!url.startsWith("intent:")) return url;
  const schemeMatch = url.match(/scheme=([^;]+)/);
  if (schemeMatch && schemeMatch[1]) {
    const scheme = schemeMatch[1];
    const path = url.replace("intent://", "").split("#")[0];
    return `${scheme}://${path}`;
  }
  return url;
};

export default function App() {
  const onShouldStartLoadWithRequest = (event: ShouldStartLoadRequest) => {
    if (event.url.startsWith("http") || event.url.startsWith("https")) {
      return true;
    } else if (Platform.OS === "android") {
      const kakaoAuthUrl = parseIntentUrl(event.url);

      const loginWithKakao = async () => {
        const supported = await Linking.canOpenURL(kakaoAuthUrl);
        if (supported) {
          await Linking.openURL(kakaoAuthUrl);
        } else {
          Alert.alert("오류", "카카오톡을 열 수 없습니다.");
        }
      };
      loginWithKakao();
      return false;
    } else if (Platform.OS === "ios") {
      const kakaoAuthUrl = event.url;

      const loginWithKakao = async () => {
        const supported = await Linking.canOpenURL(kakaoAuthUrl);
        if (supported) {
          await Linking.openURL(kakaoAuthUrl);
        } else {
          Alert.alert("오류", "카카오톡을 열 수 없습니다.");
        }
      };
      loginWithKakao();
      return false;
    }
    return true;
  };

  return (
    <WebView
      source={{ uri: "http://192.168.35.166:3000" }}
      style={styles.container}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
