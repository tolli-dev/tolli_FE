import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";
import { Platform, Linking, Alert } from "react-native";
import { parseIntentUrl } from "../utils/urlUtils";

export function useWebViewAuth() {
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

  return { onShouldStartLoadWithRequest };
}
