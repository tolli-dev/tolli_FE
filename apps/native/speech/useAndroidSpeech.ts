import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

export async function androidMicrophonePermission(): Promise<boolean> {
  const currentPermission =
    await ExpoSpeechRecognitionModule.getPermissionsAsync();
  if (currentPermission.granted) return true;

  const requestPermission =
    await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  if (requestPermission.granted) {
    return true;
  }
  return false;
}

export async function startAndroidSTT() {
  ExpoSpeechRecognitionModule.start({
    lang: "ko-KR",
    interimResults: true,
    continuous: true,
    requiresOnDeviceRecognition: true,
    contextualStrings: ["여호와", "지키시기를", "원하며"],
    androidIntentOptions: {
      EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
      EXTRA_MASK_OFFENSIVE_WORDS: false,
    },
  });
}
