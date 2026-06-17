import { useEffect, useRef } from "react";
import { Animated, Text, Pressable, StyleSheet, Platform } from "react-native";

interface Props {
  visible: boolean;
  onRetry: () => void;
}

export default function NetworkBanner({ visible, onRetry }: Props) {
  const translateY = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 120, // 보일 땐 제자리, 숨길 땐 아래로
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <Text style={styles.text}>인터넷 연결이 끊겼어요</Text>
      <Pressable onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>다시 시도</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 32 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    elevation: 8, // 안드로이드 그림자/z-order
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text: { color: "#fff", fontSize: 15, fontWeight: "600" },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#CCB5F0",
  },
  buttonText: { color: "#1B1B1B", fontWeight: "700", fontSize: 14 },
});
