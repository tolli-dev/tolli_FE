declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (data: string) => void;
    };
  }
}

export {};
