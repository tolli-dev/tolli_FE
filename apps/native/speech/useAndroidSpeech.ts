"use client";

import { RefObject, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import type { WebView as WebViewType } from "react-native-webview";

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

export function stopAndroidRecord() {
  ExpoSpeechRecognitionModule.stop();
}

export function useAndroidSpeechBridge(
  webviewRef: RefObject<WebViewType | null>,
) {
  const post = (payload: object) => {
    webviewRef.current?.postMessage(JSON.stringify(payload));
  };

  useSpeechRecognitionEvent("result", (event) => {
    post({
      type: "STT_RESULT",
      transcript: event.results[0]?.transcript ?? "",
      isFinal: event.isFinal,
    });
  });

  useSpeechRecognitionEvent("error", (event) => {
    post({
      type: "STT_ERROR",
      error: event.error,
      message: event.message,
    });
  });

  useSpeechRecognitionEvent("end", () => {
    post({
      type: "STT_END",
    });
  });
}
