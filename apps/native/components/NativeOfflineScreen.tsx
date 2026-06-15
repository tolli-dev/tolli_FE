import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";

interface Props {
  onRetry: () => void;
}

export default function NativeOfflineScreen({ onRetry }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Offline</Text>
        <View style={styles.messageBox}>
          <Text style={styles.message}>인터넷이 연결되지 않았어요</Text>
          <Text style={styles.message}>연결 후 다시 시도해주세요</Text>
        </View>
        <Image
          source={require("../assets/apple-icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={styles.button}
        onPress={onRetry}
        android_ripple={{ color: "#B79CE8" }}
      >
        <Text style={styles.buttonText}>다시 시도</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: "#1B1B1B",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 24,
    paddingVertical: 36,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: "#CCB5F0",
  },
  messageBox: {
    alignItems: "center",
  },
  message: {
    fontSize: 17,
    lineHeight: 26,
    color: "#ADADAD",
  },
  image: {
    width: 180,
    height: 180,
  },
  button: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#CCB5F0",
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "700",
    color: "#1B1B1B",
  },
});
