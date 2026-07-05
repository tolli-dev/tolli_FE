import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";

export default function UpdateRequireScreen() {
  const update = () => {
    Platform.OS === "ios"
      ? "https://apps.apple.com/kr/app/tolli/id6766518023"
      : "https://play.google.com/store/apps/details?id=com.company.tolli";
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>업데이트가 필요해요</Text>
        <View style={styles.messageBox}>
          <Text style={styles.message}>새로운 버전의 톨리가 나왔어요</Text>
          <Text style={styles.message}>
            스토어에서 업데이트 후 이용해주세요
          </Text>
        </View>
        <Image
          source={require("../assets/apple-icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Pressable style={styles.button} android_ripple={{ color: "#B79CE8" }}>
        <Text style={styles.buttonText} onPress={update}>
          업데이트 하러 가기
        </Text>
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
