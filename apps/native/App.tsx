import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useWebViewAuth } from "./src/hooks/useWebViewAuth";

export default function App() {
  const { onShouldStartLoadWithRequest } = useWebViewAuth();

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
